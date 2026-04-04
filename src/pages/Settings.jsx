import React, { useState } from 'react'

export default function Settings({ value }) {
  const { data } = value
  const [venues, setVenues] = useState(data.venues)
  const [timeSlots, setTimeSlots] = useState(data.timeSlots)

  const addVenue = () => {
    setVenues([...venues, { 
      id: Date.now(), 
      name: 'New Venue', 
      type: 'outdoor', 
      capacity: 50 
    }])
  }

  const updateVenue = (id, field, value) => {
    setVenues(venues.map(v => v.id === id ? { ...v, [field]: value } : v))
  }

  const removeVenue = (id) => {
    setVenues(venues.filter(v => v.id !== id))
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Configure venues, time slots, and preferences</p>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Venues ({venues.length})</h3>
            <button className="btn btn-sm btn-primary" onClick={addVenue}>+ Add</button>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Capacity</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {venues.map(venue => (
                  <tr key={venue.id}>
                    <td>
                      <input 
                        type="text" 
                        className="form-input"
                        value={venue.name}
                        onChange={e => updateVenue(venue.id, 'name', e.target.value)}
                        style={{ padding: '6px 10px' }}
                      />
                    </td>
                    <td>
                      <select 
                        className="form-select"
                        value={venue.type}
                        onChange={e => updateVenue(venue.id, 'type', e.target.value)}
                        style={{ padding: '6px 10px' }}
                      >
                        <option value="outdoor">Outdoor</option>
                        <option value="indoor">Indoor</option>
                      </select>
                    </td>
                    <td>
                      <input 
                        type="number"
                        className="form-input"
                        value={venue.capacity}
                        onChange={e => updateVenue(venue.id, 'capacity', parseInt(e.target.value) || 0)}
                        style={{ padding: '6px 10px', width: '80px' }}
                      />
                    </td>
                    <td>
                      <button className="btn btn-sm btn-danger" onClick={() => removeVenue(venue.id)}>×</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Time Slots</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {timeSlots.map((slot, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--background)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontWeight: 600, textTransform: 'capitalize', minWidth: '80px' }}>{slot.day}</span>
                <span>{slot.start}</span>
                <span style={{ color: 'var(--text-secondary)' }}>to</span>
                <span>{slot.end}</span>
              </div>
            ))}
          </div>
          <p style={{ marginTop: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
            Time slots are predefined. Edit timeSlots in the code to modify.
          </p>
        </div>
      </div>

      <div className="card" style={{ marginTop: '24px' }}>
        <div className="card-header">
          <h3 className="card-title">Data Management</h3>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={() => {
            const dataStr = JSON.stringify(data, null, 2)
            const blob = new Blob([dataStr], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'teamsnaplite-backup.json'
            a.click()
          }}>
            💾 Export Data
          </button>
          <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
            📂 Import Data
            <input 
              type="file" 
              accept=".json" 
              style={{ display: 'none' }}
              onChange={e => {
                const file = e.target.files[0]
                if (file) {
                  const reader = new FileReader()
                  reader.onload = (event) => {
                    try {
                      const imported = JSON.parse(event.target.result)
                      // Would need to merge with existing data structure
                      alert('Data imported! Note: This is a demo - full merge not implemented.')
                    } catch {
                      alert('Invalid JSON file')
                    }
                  }
                  reader.readAsText(file)
                }
              }}
            />
          </label>
        </div>
      </div>
    </div>
  )
}
