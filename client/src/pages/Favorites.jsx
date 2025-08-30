import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import VenueCard from '../components/VenueCard';

export default function Favorites() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return; // wait for auth
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/favorites/venues', { credentials: 'include' });
        if (!res.ok) throw new Error(`API ${res.status}`);
        const data = await res.json();
        if (!cancelled) setItems(data.items || []);
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to load favorites');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [user]);

  if (!user) {
    return (
      <main className="city">
        <header className="city-header">
          <h1>My Favorites</h1>
          <Link className="city-back" to="/">← Back to Home</Link>
        </header>
        <p>Please <Link to="/login">log in</Link> to view your favorites.</p>
      </main>
    );
  }

  return (
    <main className="city">
      <header className="city-header">
        <h1>My Favorites</h1>
        <Link className="city-back" to="/">← Back to Home</Link>
      </header>

      {error && <div role="alert" className="city-error">Error: {error}</div>}

      {loading ? (
        <p>Loading…</p>
      ) : items.length === 0 ? (
        <p>No favorites yet. Explore <Link to="/">cities</Link> and tap Like on venues you love.</p>
      ) : (
        <section aria-live="polite" className="city-list">
          <div className="venue-grid">
            {items.map(v => (
              <VenueCard key={v._id || `${v.name}-${v.address}`} venue={v} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
