import React, { useState } from 'react'
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, eachDayOfInterval, isSameDay, parseISO, isValid } from 'date-fns'

export default function Schedule({ value }) {
  const { data, generateNewSchedule } = value
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState('calendar') // 'calendar' or 'list'
  
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 })
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

  const getEventsForDay = (day) => {
    return data.schedule.filter(event => {
      try {
        const eventDate = parseISO(event.date)
        return isValid(eventDate) && isSameDay(eventDate, day)
      } catch {
        return false
      }
    })
  }

  const nextWeek = () => setCurrentDate(addWeeks(currentDate, 1))
  const prevWeek = () => setCurrentDate(subWeeks(currentDate, 1))
  const goToToday = () => setCurrentDate(new Date())

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Schedule</h1>
          <p className="page-subtitle">{data.schedule.length} games and practices scheduled</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            className={`btn ${viewMode === 'calendar' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setViewMode('calendar')}
          >
            📅 Calendar
          </button>
          <button 
            className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setViewMode('list')}
          >
            📋 List
          </button>
          <button 
            className="btn btn-accent"
            onClick={() => generateNewSchedule()}
            disabled={data.teams.length < 2}
          >
            🎲 Generate Schedule
          </button>
        </div>
      </div>

      {data.teams.length < 2 && (
        <div className="card" style={{ marginBottom: '24px', background: 'rgba(236, 201, 75, 0.1)', border: '2px solid var(--warning)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px' }}>⚠️</span>
            <div>
              <strong>Need more teams</strong>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Add at least 2 teams before generating a schedule</p>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'calendar' ? (
        <div className="calendar">
          <div className="calendar-header">
            <div className="calendar-title">
              {format(weekStart, 'MMMM d')} - {format(weekEnd, 'MMMM d, yyyy')}
            </div>
            <div className="calendar-nav">
              <button className="btn btn-sm btn-secondary" onClick={prevWeek}>←</button>
              <button className="btn btn-sm btn-secondary" onClick={goToToday}>Today</button>
              <button className="btn btn-sm btn-secondary" onClick={nextWeek}>→</button>
            </div>
          </div>
          <div className="calendar-grid">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="calendar-day-header">{day}</div>
            ))}
            {weekDays.map(day => {
              const events = getEventsForDay(day)
              const isToday = isSameDay(day, new Date())
              return (
                <div key={day.toISOString()} className={`calendar-day ${isToday ? 'today' : ''}`}>
                  <div className="calendar-day-number">{format(day, 'd')}</div>
                  {events.map(event => {
                    const homeTeam = data.teams.find(t => t.id === event.homeTeamId)
                    const awayTeam = data.teams.find(t => t.id === event.awayTeamId)
                    return (
                      <div key={event.id} className={`calendar-event ${event.type}`} title={event.type}>
                        <div style={{ fontWeight: 600 }}>{format(parseISO(event.date), 'h:mm a')}</div>
                        <div>{homeTeam?.name || 'TBD'} vs {awayTeam?.name || 'TBD'}</div>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="schedule-list">
          {data.schedule.length === 0 ? (
            <div className="card">
              <div className="empty-state">
                <div className="empty-icon">📅</div>
                <div className="empty-title">No events scheduled</div>
                <p>Generate a schedule to see games and practices</p>
              </div>
            </div>
          ) : (
            [...data.schedule]
              .toSorted((a, b) => new Date(a.date) - new Date(b.date))
              .map(event => {
                const homeTeam = data.teams.find(t => t.id === event.homeTeamId)
                const awayTeam = data.teams.find(t => t.id === event.awayTeamId)
                const venue = data.venues.find(v => v.id === event.venueId)
                return (
                  <div key={event.id} className="schedule-item">
                    <div className="schedule-date">
                      <div className="schedule-day">{format(parseISO(event.date), 'd')}</div>
                      <div className="schedule-month">{format(parseISO(event.date), 'MMM')}</div>
                    </div>
                    <div className="schedule-teams">
                      <strong>{homeTeam?.name || 'TBD'}</strong>
                      <span className="team-vs">vs</span>
                      <strong>{awayTeam?.name || 'TBD'}</strong>
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      {format(parseISO(event.date), 'h:mm a')} @ {venue?.name || 'TBD'}
                    </div>
                    <span className={`schedule-type ${event.type}`}>{event.type}</span>
                  </div>
                )
              })
          )}
        </div>
      )}
    </div>
  )
}
