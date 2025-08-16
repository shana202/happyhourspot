import { useNavigate } from 'react-router-dom';
import './Home.css'
import React from 'react';


const CITIES = [
    { label: 'Boston', slug: 'boston' },
  ]
export default function Home() {
  const navigate = useNavigate();

  const handleSelect = () => {
    navigate('/city');
  };

  return (
    <main className="home">
      <h1 className="home-title">Happy Hour Spot</h1>
      <p className="home-subtitle">Pick a city to browse happy hours.</p>

      <label htmlFor="city" className="home-label">Select a city</label>
      <select id="city" className="home-select" onChange={handleSelect} defaultValue="">
        <option value="" disabled>Choose…</option>
        {CITIES.map(c => (
          <option key={c.slug} value={c.slug}>{c.label}</option>
        ))}
      </select>
    </main>
  )
}