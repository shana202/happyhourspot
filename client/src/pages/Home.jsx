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

  const handleSelect = (slug) => {
    navigate(`/city/${slug}`);
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

<div className="home-label">Choose a city:</div>
      <div className="city-buttons">
        {CITIES.map(c => (
          <button 
            key={c.slug} 
            className="city-button"
            onClick={() => handleClick(c.slug)}
          >
            {c.label}
          </button>
        ))}
      </div>
    </main>
  )
}