import React, { useState } from 'react'

export default function Teams({ value }) {
  const { data, addTeam, updateTeam, deleteTeam, addPlayer, updatePlayer, removePlayer, addCoach, updateCoach, removeCoach } = value
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [showTeamModal, setShowTeamModal] = useState(false)
  const [showPlayerModal, setShowPlayerModal] = useState(false)
  const [showCoachModal, setShowCoachModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  const sports = ['Soccer', 'Basketball', 'Baseball', 'Football', 'Volleyball', 'Hockey', 'Softball', 'Lacrosse', 'Tennis', 'Other']
  const seasons = ['Spring 2025', 'Summer 2025', 'Fall 2025', 'Winter 2025', 'Spring 2026', 'Summer 2026']

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Teams</h1>
          <p className="page-subtitle">Manage your teams, players, and coaches</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditingItem(null); setShowTeamModal(true) }}>
          + New Team
        </button>
      </div>

      {selectedTeam ? (
        <TeamDetail 
          team={selectedTeam} 
          players={data.players[selectedTeam.id] || []}
          coaches={data.coaches[selectedTeam.id] || []}
          onBack={() => setSelectedTeam(null)}
          onUpdateTeam={updateTeam}
          onDeleteTeam={deleteTeam}
          onAddPlayer={() => { setEditingItem(null); setShowPlayerModal(true) }}
          onEditPlayer={(player) => { setEditingItem({ player, teamId: selectedTeam.id }); setShowPlayerModal(true) }}
          onRemovePlayer={(playerId) => removePlayer(selectedTeam.id, playerId)}
          onAddCoach={() => { setEditingItem(null); setShowCoachModal(true) }}
          onEditCoach={(coach) => { setEditingItem({ coach, teamId: selectedTeam.id }); setShowCoachModal(true) }}
          onRemoveCoach={(coachId) => removeCoach(selectedTeam.id, coachId)}
        />
      ) : (
        <div className="grid grid-3">
          {data.teams.length === 0 ? (
            <div className="card" style={{ gridColumn: '1 / -1' }}>
              <div className="empty-state">
                <div className="empty-icon">👥</div>
                <div className="empty-title">No teams yet</div>
                <p>Create your first team to get started</p>
              </div>
            </div>
          ) : (
            data.teams.map(team => (
              <div key={team.id} className="team-card" onClick={() => setSelectedTeam(team)}>
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
            ))
          )}
        </div>
      )}

      {showTeamModal && (
        <TeamModal 
          team={editingItem}
          sports={sports}
          seasons={seasons}
          onClose={() => setShowTeamModal(false)}
          onSave={(teamData) => {
            if (editingItem) {
              updateTeam(editingItem.id, teamData)
            } else {
              addTeam(teamData)
            }
            setShowTeamModal(false)
          }}
        />
      )}

      {showPlayerModal && (
        <PersonModal 
          title={editingItem ? "Edit Player" : "Add Player"}
          item={editingItem?.player}
          fields={[
            { name: 'name', label: 'Name', required: true },
            { name: 'email', label: 'Email', type: 'email' },
            { name: 'phone', label: 'Phone', type: 'tel' },
            { name: 'position', label: 'Position' },
            { name: 'jerseyNumber', label: 'Jersey #', type: 'number' }
          ]}
          onClose={() => setShowPlayerModal(false)}
          onSave={(playerData) => {
            if (editingItem?.player) {
              updatePlayer(editingItem.teamId, editingItem.player.id, playerData)
            } else {
              addPlayer(selectedTeam?.id || editingItem?.teamId, playerData)
            }
            setShowPlayerModal(false)
          }}
        />
      )}

      {showCoachModal && (
        <PersonModal 
          title={editingItem ? "Edit Coach" : "Add Coach"}
          item={editingItem?.coach}
          fields={[
            { name: 'name', label: 'Name', required: true },
            { name: 'email', label: 'Email', type: 'email' },
            { name: 'phone', label: 'Phone', type: 'tel' },
            { name: 'role', label: 'Role (e.g., Head Coach, Assistant)' }
          ]}
          onClose={() => setShowCoachModal(false)}
          onSave={(coachData) => {
            if (editingItem?.coach) {
              updateCoach(editingItem.teamId, editingItem.coach.id, coachData)
            } else {
              addCoach(selectedTeam?.id || editingItem?.teamId, coachData)
            }
            setShowCoachModal(false)
          }}
        />
      )}
    </div>
  )
}

function TeamDetail({ team, players, coaches, onBack, onUpdateTeam, onDeleteTeam, onAddPlayer, onEditPlayer, onRemovePlayer, onAddCoach, onEditCoach, onRemoveCoach }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  return (
    <div>
      <button className="btn btn-secondary" onClick={onBack} style={{ marginBottom: '20px' }}>
        ← Back to Teams
      </button>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <div>
            <h2 style={{ color: 'var(--primary)' }}>{team.name}</h2>
            <p style={{ color: 'var(--text-secondary)' }}>{team.sport} • {team.season}</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-sm btn-secondary" onClick={() => onUpdateTeam(team.id, { name: team.name, sport: team.sport, season: team.season })}>Edit</button>
            <button className="btn btn-sm btn-danger" onClick={() => setShowDeleteConfirm(true)}>Delete</button>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Delete Team?</h3>
              <button className="modal-close" onClick={() => setShowDeleteConfirm(false)}>×</button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete <strong>{team.name}</strong>? This will also remove all players and coaches.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => { onDeleteTeam(team.id); onBack() }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-2">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Players ({players.length})</h3>
            <button className="btn btn-sm btn-primary" onClick={onAddPlayer}>+ Add</button>
          </div>
          {players.length === 0 ? (
            <div className="empty-state" style={{ padding: '24px' }}>
              <p>No players yet</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Position</th>
                    <th>Jersey</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map(player => (
                    <tr key={player.id}>
                      <td>
                        <strong>{player.name}</strong>
                        {player.email && <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{player.email}</div>}
                      </td>
                      <td>{player.position || '-'}</td>
                      <td>{player.jerseyNumber || '-'}</td>
                      <td>
                        <button className="btn btn-sm btn-secondary" onClick={() => onEditPlayer(player)}>Edit</button>
                        <button className="btn btn-sm btn-danger" style={{ marginLeft: '8px' }} onClick={() => onRemovePlayer(player.id)}>×</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Coaches ({coaches.length})</h3>
            <button className="btn btn-sm btn-primary" onClick={onAddCoach}>+ Add</button>
          </div>
          {coaches.length === 0 ? (
            <div className="empty-state" style={{ padding: '24px' }}>
              <p>No coaches yet</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coaches.map(coach => (
                    <tr key={coach.id}>
                      <td>
                        <strong>{coach.name}</strong>
                        {coach.email && <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{coach.email}</div>}
                      </td>
                      <td>{coach.role || 'Coach'}</td>
                      <td>
                        <button className="btn btn-sm btn-secondary" onClick={() => onEditCoach(coach)}>Edit</button>
                        <button className="btn btn-sm btn-danger" style={{ marginLeft: '8px' }} onClick={() => onRemoveCoach(coach.id)}>×</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function TeamModal({ team, sports, seasons, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: team?.name || '',
    sport: team?.sport || 'Soccer',
    season: team?.season || 'Spring 2025'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name.trim()) return
    onSave(formData)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{team ? 'Edit Team' : 'New Team'}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Team Name *</label>
              <input 
                type="text" 
                className="form-input"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Tigers"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Sport</label>
              <select 
                className="form-select"
                value={formData.sport}
                onChange={e => setFormData({ ...formData, sport: e.target.value })}
              >
                {sports.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Season</label>
              <select 
                className="form-select"
                value={formData.season}
                onChange={e => setFormData({ ...formData, season: e.target.value })}
              >
                {seasons.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">{team ? 'Update' : 'Create'} Team</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function PersonModal({ title, item, fields, onClose, onSave }) {
  const [formData, setFormData] = useState(
    fields.reduce((acc, f) => ({ ...acc, [f.name]: item?.[f.name] || '' }), {})
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name.trim()) return
    onSave(formData)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {fields.map(field => (
              <div key={field.name} className="form-group">
                <label className="form-label">
                  {field.label} {field.required && '*'}
                </label>
                <input 
                  type={field.type || 'text'}
                  className="form-input"
                  value={formData[field.name]}
                  onChange={e => setFormData({ ...formData, [field.name]: e.target.value })}
                  required={field.required}
                />
              </div>
            ))}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  )
}
