import { useNavigate } from 'react-router-dom';
import './Home.css'
import React from 'react';
import headerImg from '../assets/images/header.png'


const CITIES = [
    { label: 'Boston', slug: 'boston' },
    { label: 'Albany', slug: 'albany' },
    { label: 'Schenectady', slug: 'schenectady' },
    { label: 'Champaign-Urbana-Savoy', slug: 'champaign-urbana-savoy' },
    { label: 'Pittsburgh', slug: 'pittsburgh' },
  ]
export default function Home() {
  const navigate = useNavigate();
  const [suggested, setSuggested] = React.useState(null); // slug or null

  const handleSelect = (slug) => {
    navigate(`/city/${slug}`);
  }
  const sortedCities = [...CITIES].sort((a, b) => a.label.localeCompare(b.label));

  React.useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams(window.location.search);
    const testIp = params.get('ip'); // dev/testing: /?ip=1.2.3.4
    const url = testIp && import.meta.env.MODE !== 'production'
      ? `/api/geo/suggest-city?ip=${encodeURIComponent(testIp)}`
      : '/api/geo/suggest-city';

    fetch(url, { credentials: 'include' })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => { if (!cancelled) setSuggested(data?.suggestion || null); })
      .catch(() => { if (!cancelled) setSuggested(null); });
    return () => { cancelled = true; };
  }, []);

  return (
    <main className="home">
      <div className="home-hero">
        <img src={headerImg} alt="Happy Hour Spot" />
      </div>
      <h1 className="home-title">Happy Hour Spot</h1>
      <p className="home-content">Discover the best happy hour deals in your city, all in one place. From craft cocktails to tasty bites, we make it easy to find specials that fit your vibe and your budget. 
Start exploring now and never miss your next great pour or plate.
</p>

{suggested && (
  <div className="home-label">Suggested city: {sortedCities.find(c => c.slug === suggested)?.label || suggested}
    <button style={{ marginLeft: 8 }} onClick={() => handleSelect(suggested)}>Open</button>
  </div>
)}
<div className="home-label">Choose a city:(more coming soon)</div>
      <div className="city-buttons">
        {sortedCities.map(c => (
          <button 
            key={c.slug} 
            className="city-button"
            onClick={() => handleSelect(c.slug)}
          >
            {c.label}
          </button>
        ))}
      </div>
    </main>
  )
}
