import { useNavigate } from 'react-router-dom';
import './Home.css'
import React from 'react';
import headerImg from '../assets/images/header.png'


const CITIES = [
    { label: 'Boston', slug: 'boston' },
    { label: 'Albany', slug: 'albany' },
  ]
export default function Home() {
  const navigate = useNavigate();

  const handleSelect = (e) => {
    const slug = e.target.value
    if (slug) navigate(`/city/${slug}`)
  }

  return (
    <main className="home">
      <div className="home-hero">
        <img src={headerImg} alt="Happy Hour Spot" />
      </div>
      <h1 className="home-title">Happy Hour Spot</h1>
      <p className="home-content">Discover the best happy hour deals in your city, all in one place. From craft cocktails to tasty bites, we make it easy to find specials that fit your vibe and your budget. 
Start exploring now and never miss your next great pour or plate.
</p>

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