import React from 'react'
import { Link } from 'react-router-dom'

export default function Dashboard({ value }) {
  const { data } = value
  const totalPlayers = Object.values(data.players).flat().length
  const totalCoaches = Object.values(data.coaches).flat().length
  const upcomingGames = data.schedule.filter(s => s.type === 'game').length
  const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const upcomingThisWeek = data.schedule.filter(s => new Date(s.date) <= nextWeek)

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Overview of your youth sports league</p>
        </div>
        <Link to="/teams" className="btn btn-primary">
          + New Team
        </Link>
      </div>

      <div className="grid grid-4" style={{ marginBottom: '32px' }}>
        <div className="stat-card">
          <div className="stat-value">{data.teams.length}</div>
          <div className="stat-label">Active Teams</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalPlayers}</div>
          <div className="stat-label">Total Players</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalCoaches}</div>
          <div className="stat-label">Coaches</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{upcomingGames}</div>
          <div className="stat-label">Scheduled Games</div>
        </div>
      </div>

      {data.teams.length > 0 ? (
        <div className="grid grid-3">
          {data.teams.slice(0, 3).map(team => (
            <div key={team.id} className="team-card">
              <div className="team-card-header">
                <div>
                  <div className="team-name">{team.name}</div>
                  <div className="team-sport">{team.sport}</div>
                </div>
                <span className="badge badge-primary">{team.season}</span>
              </div>
              <div className="team-meta">
                <span>👥 {data.players[team.id]?.length || 0} players</span>
                <span>👨‍🏫 {data.coaches[team.id]?.length || 0} coaches</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">🏆</div>
            <div className="empty-title">No teams yet</div>
            <p>Create your first team to get started</p>
            <Link to="/teams" className="btn btn-primary" style={{ marginTop: '16px' }}>
              Create Team
            </Link>
          </div>
        </div>
      )}

      {upcomingThisWeek.length > 0 && (
        <div className="card" style={{ marginTop: '24px' }}>
          <div className="card-header">
            <h3 className="card-title">This Week's Schedule</h3>
            <Link to="/schedule" className="btn btn-sm btn-secondary">View All</Link>
          </div>
          <div className="schedule-list">
            {upcomingThisWeek.slice(0, 5).map(game => {
              const homeTeam = data.teams.find(t => t.id === game.homeTeamId)
              const awayTeam = data.teams.find(t => t.id === game.awayTeamId)
              return (
                <div key={game.id} className="schedule-item">
                  <div className="schedule-date">
                    <div className="schedule-day">{new Date(game.date).getDate()}</div>
                    <div className="schedule-month">{new Date(game.date).toLocaleString('default', { month: 'short' })}</div>
                  </div>
                  <div className="schedule-teams">
                    <strong>{homeTeam?.name || 'TBD'}</strong>
                    <span className="team-vs">vs</span>
                    <strong>{awayTeam?.name || 'TBD'}</strong>
                  </div>
                  <span className={`schedule-type ${game.type}`}>{game.type}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
