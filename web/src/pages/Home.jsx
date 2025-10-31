import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const ipRegex = /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/

export default function Home() {
  const { user, logout } = useAuth()
  const [query, setQuery] = useState('')
  const [geo, setGeo] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])
  const [selected, setSelected] = useState([])

  const mapUrl = useMemo(() => {
    if (!geo?.loc) return null
    const [lat, lon] = geo.loc.split(',')
    return `https://www.openstreetmap.org/export/embed.html?bbox=${lon}%2C${lat}%2C${lon}%2C${lat}&layer=mapnik&marker=${lat}%2C${lon}`
  }, [geo])

  useEffect(() => {
    fetchOwnGeo()
    const stored = localStorage.getItem('history')
    if (stored) setHistory(JSON.parse(stored))
  }, [])

  const saveHistory = (list) => {
    setHistory(list)
    localStorage.setItem('history', JSON.stringify(list))
  }

  const fetchOwnGeo = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await axios.get('https://ipinfo.io//geo')
      setGeo(res.data)
    } catch (e) {
      setError('Failed to load your geolocation info')
    } finally {
      setLoading(false)
    }
  }

  const fetchIpGeo = async (ip) => {
    try {
      setLoading(true)
      setError('')
      const url = ip ? `https://ipinfo.io/${ip}/geo` : 'https://ipinfo.io//geo'
      const res = await axios.get(url)
      setGeo(res.data)
      if (ip) {
        const next = [ip, ...history.filter((h) => h !== ip)].slice(0, 20)
        saveHistory(next)
      }
    } catch (e) {
      setError('Invalid IP or failed to fetch geolocation')
    } finally {
      setLoading(false)
    }
  }

  const onSearch = (e) => {
    e.preventDefault()
    if (!query) return fetchOwnGeo()
    if (!ipRegex.test(query.trim())) {
      setError('Please enter a valid IPv4 address')
      return
    }
    fetchIpGeo(query.trim())
  }

  const onClear = () => {
    setQuery('')
    setError('')
    fetchOwnGeo()
  }

  const toggleSelect = (ip) => {
    setSelected((prev) => (prev.includes(ip) ? prev.filter((x) => x !== ip) : [...prev, ip]))
  }

  const deleteSelected = () => {
    const next = history.filter((ip) => !selected.includes(ip))
    saveHistory(next)
    setSelected([])
  }

  return (
    <div className="container">
      <div className="topbar">
        <div>
          <div className="muted">Logged in as</div>
          <div><strong>{user?.name}</strong> <span className="muted">({user?.email})</span></div>
        </div>
        <button className="secondary" onClick={logout}>Logout</button>
      </div>

      <div className="card">
        <h1>IP Geolocation</h1>
        <form onSubmit={onSearch} className="row">
          <input
            placeholder="Enter IP address (e.g. 8.8.8.8)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit">Search</button>
          <button type="button" className="secondary" onClick={onClear}>Clear</button>
        </form>
        {error && <div className="error" style={{ marginTop: 8 }}>{error}</div>}
      </div>

      <div className="grid">
        <div className="card">
          <h2>Details</h2>
          {loading && <div>Loading...</div>}
          {!loading && geo && (
            <div className="details">
              <div><strong>IP:</strong> {geo.ip}</div>
              <div><strong>City:</strong> {geo.city}</div>
              <div><strong>Region:</strong> {geo.region}</div>
              <div><strong>Country:</strong> {geo.country}</div>
              <div><strong>Location:</strong> {geo.loc}</div>
              <div><strong>Org:</strong> {geo.org}</div>
              <div><strong>Timezone:</strong> {geo.timezone}</div>
            </div>
          )}
        </div>
        <div className="card">
          <h2>Map</h2>
          {geo?.loc ? (
            <iframe
              title="map"
              src={mapUrl}
              style={{ width: '100%', height: 300, border: 0 }}
              allowFullScreen
            />
          ) : (
            <div className="muted">No location available</div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="row" style={{ alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>History</h2>
          {selected.length > 0 && (
            <button className="danger" onClick={deleteSelected}>Delete Selected ({selected.length})</button>
          )}
        </div>
        {history.length === 0 ? (
          <div className="muted">No history yet</div>
        ) : (
          <ul className="history">
            {history.map((ip) => (
              <li key={ip} className="history-item">
                <label>
                  <input type="checkbox" checked={selected.includes(ip)} onChange={() => toggleSelect(ip)} />
                </label>
                <button className="link" onClick={() => fetchIpGeo(ip)}>{ip}</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
