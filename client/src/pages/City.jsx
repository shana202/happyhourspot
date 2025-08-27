import { useEffect, useRef, useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import VenueCard from '../components/VenueCard'
import './City.css'

const CITY_LABELS = {
  'boston': 'Boston',
  'albany': 'Albany',
  
}

export default function City() {
  const { slug } = useParams()
  const cityLabel = CITY_LABELS[slug] || slug
  const [venues, setVenues] = useState([])
  const [next, setNext] = useState(null)     
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const apiBase = useMemo(() => '/api/venues', [])
  const abortRef = useRef(null)

  const loadPage = async (cursor) => {
    if (loading) return // guard against rapid re-clicks
    setLoading(true)
    setError(null)

    if (abortRef.current) abortRef.current.abort()
        const controller = new AbortController()
        abortRef.current = controller
    
        try {
          const params = new URLSearchParams({ city: slug })
          if (cursor) params.set('after', cursor)
    
          const res = await fetch(`${apiBase}?${params.toString()}`, {
            cache: 'no-store',
            signal: controller.signal,
            headers: { 'Accept': 'application/json' }
          })
          if (!res.ok) throw new Error(`API ${res.status}`)
          const data = await res.json() // { items: [...], next: "cursor-or-null" }

          setVenues(prev => {
            const seen = new Set(prev.map(v => v._id || `${v.name}-${v.address}`))
            const fresh = []
            for (const v of data.items || []) {
              const key = v._id || `${v.name}-${v.address}`
              if (!seen.has(key)) {
                seen.add(key)
                fresh.push(v)
              }
            }
            return [...prev, ...fresh]
          })
    
          setNext(data.next || null)
        } catch (e) {
          if (e.name !== 'AbortError') setError(e.message || 'Failed to load venues')
        } finally {
          setLoading(false)
        }
    }

  useEffect(() => {
    
    setVenues([])
    setNext(null)
    setError(null)
    loadPage(null)
    return () => abortRef.current?.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  return (
    <main className="city">
      <header className="city-header">
        <h1>{cityLabel} Happy Hours</h1>
        {/*<Link className="city-back" to="/">← Choose another city</Link>*/}
      </header>

      {error && <div role="alert" className="city-error">Error: {error}</div>}

      <section aria-live="polite" className="city-list">
        <div className="venue-grid">
        {venues.map(v => (
          <VenueCard key={v._id || `${v.name}-${v.address}`} venue={v} />
        ))}
        </div>
      </section>

      {/* <div className="city-actions">
        {next && !loading && (
          <button className="city-loadmore" onClick={() => fetchPage(next)}>
            Load more
          </button>
        )}
        {loading && <span className="city-loading">Loading…</span>}
        {!loading && venues.length === 0 && !error && (
          <p className="city-empty">No venues found.</p>
        )}
      </div> */}
    </main>
  )
}
