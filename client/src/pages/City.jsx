import { useEffect, useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import VenueCard from '../components/VenueCard'
import './City.css'

const CITY_LABELS = {
  'boston': 'Boston',
  
}

export default function City() {
  const { slug } = useParams()
  const cityLabel = CITY_LABELS[slug] || slug
  const [venues, setVenues] = useState([])
  const [next, setNext] = useState(null)     // cursor (last venue name)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const apiBase = useMemo(() => '/api/venues', [])

  const fetchPage = async (cursor) => {
    try {
      setLoading(true)
      setError(null)
      const params = new URLSearchParams({ city: slug, limit: '20' })
      if (cursor) params.set('after', cursor)
      const res = await fetch(`${apiBase}?${params.toString()}`)
      if (!res.ok) throw new Error(`API ${res.status}`)
      const data = await res.json()
      setVenues(prev => [...prev, ...(data.items || [])])
      setNext(data.next || null)
    } catch (e) {
      setError(e.message || 'Failed to load venues')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // reset when slug changes
    setVenues([])
    setNext(null)
    setError(null)
    fetchPage(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  return (
    <main className="city">
      <header className="city-header">
        <h1>{cityLabel} Happy Hours</h1>
        <Link className="city-back" to="/">← Choose another city</Link>
      </header>

      {error && <div role="alert" className="city-error">Error: {error}</div>}

      <section aria-live="polite" className="city-list">
        {venues.map(v => (
          <VenueCard key={v._id || `${v.name}-${v.address}`} venue={v} />
        ))}
      </section>

      <div className="city-actions">
        {next && !loading && (
          <button className="city-loadmore" onClick={() => fetchPage(next)}>
            Load more
          </button>
        )}
        {loading && <span className="city-loading">Loading…</span>}
        {!loading && venues.length === 0 && !error && (
          <p className="city-empty">No venues found.</p>
        )}
      </div>
    </main>
  )
}
