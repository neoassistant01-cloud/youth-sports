import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { format, parseISO, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns'
import Dashboard from './pages/Dashboard'
import Teams from './pages/Teams'
import Schedule from './pages/Schedule'
import Settings from './pages/Settings'
import { generateSchedule } from './utils/scheduler'

const STORAGE_KEY = 'teamsnaplite_data'

const initialData = {
  teams: [],
  players: {},
  coaches: {},
  schedule: [],
  venues: [
    { id: 1, name: 'Main Field', type: 'outdoor', capacity: 100 },
    { id: 2, name: 'Community Center Court', type: 'indoor', capacity: 50 },
    { id: 3, name: 'East Park Field', type: 'outdoor', capacity: 80 },
    { id: 4, name: 'High School Gym', type: 'indoor', capacity: 60 }
  ],
  timeSlots: [
    { day: 'monday', start: '16:00', end: '18:00' },
    { day: 'tuesday', start: '16:00', end: '18:00' },
    { day: 'wednesday', start: '16:00', end: '18:00' },
    { day: 'thursday', start: '16:00', end: '18:00' },
    { day: 'friday', start: '16:00', end: '20:00' },
    { day: 'saturday', start: '08:00', end: '18:00' },
    { day: 'sunday', start: '08:00', end: '18:00' }
  ]
}

function App() {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : initialData
  })
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [data])

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  // Team operations
  const addTeam = (team) => {
    const newTeam = { 
      ...team, 
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    setData(prev => ({
      ...prev,
      teams: [...prev.teams, newTeam],
      players: { ...prev.players, [newTeam.id]: [] },
      coaches: { ...prev.coaches, [newTeam.id]: [] }
    }))
    showNotification('Team created successfully!')
    return newTeam
  }

  const updateTeam = (teamId, updates) => {
    setData(prev => ({
      ...prev,
      teams: prev.teams.map(t => t.id === teamId ? { ...t, ...updates } : t)
    }))
    showNotification('Team updated!')
  }

  const deleteTeam = (teamId) => {
    setData(prev => {
      const { [teamId]: removedPlayers, ...remainingPlayers } = prev.players
      const { [teamId]: removedCoaches, ...remainingCoaches } = prev.coaches
      return {
        ...prev,
        teams: prev.teams.filter(t => t.id !== teamId),
        players: remainingPlayers,
        coaches: remainingCoaches,
        schedule: prev.schedule.filter(s => s.homeTeamId !== teamId && s.awayTeamId !== teamId)
      }
    })
    showNotification('Team deleted')
  }

  // Player operations
  const addPlayer = (teamId, player) => {
    const newPlayer = { ...player, id: Date.now().toString() }
    setData(prev => ({
      ...prev,
      players: {
        ...prev.players,
        [teamId]: [...(prev.players[teamId] || []), newPlayer]
      }
    }))
    showNotification('Player added!')
    return newPlayer
  }

  const updatePlayer = (teamId, playerId, updates) => {
    setData(prev => ({
      ...prev,
      players: {
        ...prev.players,
        [teamId]: prev.players[teamId].map(p => p.id === playerId ? { ...p, ...updates } : p)
      }
    }))
    showNotification('Player updated!')
  }

  const removePlayer = (teamId, playerId) => {
    setData(prev => ({
      ...prev,
      players: {
        ...prev.players,
        [teamId]: prev.players[teamId].filter(p => p.id !== playerId)
      }
    }))
    showNotification('Player removed')
  }

  // Coach operations
  const addCoach = (teamId, coach) => {
    const newCoach = { ...coach, id: Date.now().toString() }
    setData(prev => ({
      ...prev,
      coaches: {
        ...prev.coaches,
        [teamId]: [...(prev.coaches[teamId] || []), newCoach]
      }
    }))
    showNotification('Coach added!')
    return newCoach
  }

  const updateCoach = (teamId, coachId, updates) => {
    setData(prev => ({
      ...prev,
      coaches: {
        ...prev.coaches,
        [teamId]: prev.coaches[teamId].map(c => c.id === coachId ? { ...c, ...updates } : c)
      }
    }))
    showNotification('Coach updated!')
  }

  const removeCoach = (teamId, coachId) => {
    setData(prev => ({
      ...prev,
      coaches: {
        ...prev.coaches,
        [teamId]: prev.coaches[teamId].filter(c => c.id !== coachId)
      }
    }))
    showNotification('Coach removed')
  }

  // Schedule operations
  const generateNewSchedule = (options = {}) => {
    if (data.teams.length < 2) {
      showNotification('Need at least 2 teams to generate schedule', 'warning')
      return
    }
    const schedule = generateSchedule(data.teams, data.venues, data.timeSlots, options)
    setData(prev => ({ ...prev, schedule }))
    showNotification(`Generated ${schedule.length} games!`)
  }

  const value = {
    data,
    addTeam,
    updateTeam,
    deleteTeam,
    addPlayer,
    updatePlayer,
    removePlayer,
    addCoach,
    updateCoach,
    removeCoach,
    generateNewSchedule
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <Link to="/" className="logo">
            <span className="logo-icon">⚽</span>
            <span className="logo-text">TeamSnap Lite</span>
          </Link>
          <nav className="main-nav">
            <NavLink to="/" icon="📊">Dashboard</NavLink>
            <NavLink to="/teams" icon="👥">Teams</NavLink>
            <NavLink to="/schedule" icon="📅">Schedule</NavLink>
            <NavLink to="/settings" icon="⚙️">Settings</NavLink>
          </nav>
        </div>
      </header>

      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Dashboard value={value} />} />
          <Route path="/teams" element={<Teams value={value} />} />
          <Route path="/schedule" element={<Schedule value={value} />} />
          <Route path="/settings" element={<Settings value={value} />} />
        </Routes>
      </main>
    </div>
  )
}

function NavLink({ to, icon, children }) {
  const location = useLocation()
  const isActive = location.pathname === to
  return (
    <Link to={to} className={`nav-link ${isActive ? 'active' : ''}`}>
      <span className="nav-icon">{icon}</span>
      <span>{children}</span>
    </Link>
  )
}

export default App
