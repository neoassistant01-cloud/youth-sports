/**
 * Youth Sports Scheduling Algorithm
 * 
 * Constraints:
 * - No back-to-back games for same team on same day
 * - Maximum 2 games per team per week
 * - Preferred rest days between games
 * - Venue capacity respected
 * - Round-robin style home/away for all team pairs
 */

import { addDays, format, parseISO, isWeekend, getDay } from 'date-fns'

// Generate available dates for a season (default 12 weeks)
function generateSeasonDates(startDate, weeks = 12) {
  const dates = []
  let current = new Date(startDate)
  for (let i = 0; i < weeks * 7; i++) {
    const dayOfWeek = getDay(current)
    // Skip Sundays (day 0) - rest day
    if (dayOfWeek !== 0) {
      dates.push(new Date(current))
    }
    current = addDays(current, 1)
  }
  return dates
}

// Get available time slots for a given date
function getAvailableSlots(date, timeSlots, venues) {
  const dayName = format(date, 'EEEE').toLowerCase()
  const slots = timeSlots.filter(s => s.day === dayName || (s.day === 'saturday' && isWeekend(date)) || (s.day === 'sunday' && isWeekend(date)))
  
  const result = []
  slots.forEach(slot => {
    venues.forEach(venue => {
      result.push({
        date: format(date, 'yyyy-MM-dd'),
        startTime: slot.start,
        endTime: slot.end,
        venueId: venue.id,
        venueName: venue.name
      })
    })
  })
  return result
}

// Check if team has game on this date
function hasGameOnDate(schedule, teamId, dateStr) {
  return schedule.some(g => 
    (g.homeTeamId === teamId || g.awayTeamId === teamId) && 
    g.date === dateStr
  )
}

// Count games for team in a week
function gamesThisWeek(schedule, teamId, dateStr) {
  const date = parseISO(dateStr)
  const weekStart = new Date(date)
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1) // Monday
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 6) // Sunday
  
  return schedule.filter(g => {
    const gDate = parseISO(g.date)
    const teamInGame = g.homeTeamId === teamId || g.awayTeamId === teamId
    return teamInGame && gDate >= weekStart && gDate <= weekEnd
  }).length
}

// Check if team played recently (within last 2 days)
function hadRecentGame(schedule, teamId, dateStr) {
  const date = parseISO(dateStr)
  const twoDaysAgo = addDays(date, -2)
  
  return schedule.some(g => {
    const gDate = parseISO(g.date)
    const teamInGame = g.homeTeamId === teamId || g.awayTeamId === teamId
    return teamInGame && gDate >= twoDaysAgo && gDate < date
  })
}

// Generate all team pairs for round-robin
function generateTeamPairs(teams) {
  const pairs = []
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      pairs.push({
        home: teams[i].id,
        away: teams[j].id,
        // Alternate home/away
        homeTeamId: Math.random() > 0.5 ? teams[i].id : teams[j].id,
        awayTeamId: Math.random() > 0.5 ? teams[j].id : teams[i].id
      })
    }
  }
  // Shuffle pairs for variety
  return pairs.sort(() => Math.random() - 0.5)
}

/**
 * Main scheduling function
 * @param {Array} teams - Array of team objects
 * @param {Array} venues - Array of venue objects
 * @param {Array} timeSlots - Array of time slot configurations
 * @param {Object} options - Optional settings (startDate, weeks)
 * @returns {Array} - Generated schedule
 */
export function generateSchedule(teams, venues, timeSlots, options = {}) {
  if (teams.length < 2) {
    return []
  }

  const startDate = options.startDate ? new Date(options.startDate) : new Date()
  const weeks = options.weeks || 10
  const maxGamesPerTeamPerWeek = options.maxGamesPerTeamPerWeek || 2
  
  // Generate season dates
  const seasonDates = generateSeasonDates(startDate, weeks)
  
  // Get all available slots
  let allSlots = []
  seasonDates.forEach(date => {
    const slots = getAvailableSlots(date, timeSlots, venues)
    allSlots = [...allSlots, ...slots]
  })
  
  // Shuffle slots to add variety
  allSlots.sort(() => Math.random() - 0.5)
  
  // Generate team pairs
  const teamPairs = generateTeamPairs(teams)
  
  const schedule = []
  const gamesPerTeam = {} // Track games per team to ensure balance
  
  teams.forEach(t => {
    gamesPerTeam[t.id] = 0
  })
  
  // Assign games to slots
  for (const pair of teamPairs) {
    // Find best slot for this game
    let bestSlot = null
    let bestScore = -1
    
    for (const slot of allSlots) {
      if (schedule.some(s => s.venueId === slot.venueId && s.date === slot.date && s.startTime === slot.startTime)) {
        continue // Venue occupied
      }
      
      if (hasGameOnDate(schedule, pair.homeTeamId, slot.date)) {
        continue // Home team already has game that day
      }
      
      if (hasGameOnDate(schedule, pair.awayTeamId, slot.date)) {
        continue // Away team already has game that day
      }
      
      if (gamesThisWeek(schedule, pair.homeTeamId, slot.date) >= maxGamesPerTeamPerWeek) {
        continue // Home team at max games this week
      }
      
      if (gamesThisWeek(schedule, pair.awayTeamId, slot.date) >= maxGamesPerTeamPerWeek) {
        continue // Away team at max games this week
      }
      
      if (hadRecentGame(schedule, pair.homeTeamId, slot.date)) {
        continue // Home team played recently
      }
      
      if (hadRecentGame(schedule, pair.awayTeamId, slot.date)) {
        continue // Away team played recently
      }
      
      // Score this slot (prefer weekends, later slots)
      let score = 0
      const slotDate = parseISO(slot.date)
      if (isWeekend(slotDate)) score += 10 // Prefer weekends
      score += parseInt(slot.startTime.split(':')[0]) // Later times slightly preferred
      
      if (score > bestScore) {
        bestScore = score
        bestSlot = slot
      }
    }
    
    if (bestSlot) {
      // Mark slot as used
      allSlots = allSlots.filter(s => !(s.date === bestSlot.date && s.startTime === bestSlot.startTime && s.venueId === bestSlot.venueId))
      
      // Add game to schedule
      const game = {
        id: `game_${schedule.length + 1}`,
        homeTeamId: pair.homeTeamId,
        awayTeamId: pair.awayTeamId,
        date: bestSlot.date,
        startTime: bestSlot.startTime,
        endTime: bestSlot.endTime,
        venueId: bestSlot.venueId,
        type: 'game'
      }
      schedule.push(game)
      gamesPerTeam[pair.homeTeamId]++
      gamesPerTeam[pair.awayTeamId]++
    }
  }
  
  // Add some practice sessions
  const remainingSlots = allSlots.slice(0, Math.min(10, allSlots.length / 10))
  remainingSlots.forEach((slot, idx) => {
    const randomTeam = teams[Math.floor(Math.random() * teams.length)]
    schedule.push({
      id: `practice_${idx + 1}`,
      homeTeamId: randomTeam.id,
      awayTeamId: null,
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      venueId: slot.venueId,
      type: 'practice'
    })
  })
  
  // Sort by date
  schedule.sort((a, b) => new Date(a.date) - new Date(b.date))
  
  return schedule
}

/**
 * Export schedule to iCal format
 */
export function exportToICal(schedule, teams, venues) {
  let ical = 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//TeamSnap Lite//EN\r\n'
  
  schedule.forEach(event => {
    const homeTeam = teams.find(t => t.id === event.homeTeamId)
    const awayTeam = teams.find(t => t.id === event.awayTeamId)
    const venue = venues.find(v => v.id === event.venueId)
    
    const dateStr = event.date.replace(/-/g, '')
    const startTime = event.startTime.replace(':', '') + '00'
    const endTime = event.endTime.replace(':', '') + '00'
    
    const title = event.type === 'practice' 
      ? `Practice - ${homeTeam?.name || 'Team'}`
      : `${homeTeam?.name || 'Home'} vs ${awayTeam?.name || 'Away'}`
    
    ical += 'BEGIN:VEVENT\r\n'
    ical += `DTSTART:${dateStr}T${startTime}\r\n`
    ical += `DTEND:${dateStr}T${endTime}\r\n`
    ical += `SUMMARY:${title}\r\n`
    if (venue) ical += `LOCATION:${venue.name}\r\n`
    ical += 'END:VEVENT\r\n'
  })
  
  ical += 'END:VCALENDAR\r\n'
  return ical
}
