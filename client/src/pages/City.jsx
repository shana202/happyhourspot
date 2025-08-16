import './City.css'         
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import VenueCard from '../components/VenueCard';
import { useEffect, useState } from 'react';

const CITIES = [
  { label: 'Boston', slug: 'boston' },
];

export default function City() {
  const { citySlug } = useParams();
  const [venues, setVenues] = useState([]);

  const fetchPage = async () => {
    try {
      const response = await fetch(`/api/cities/${citySlug}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setVenues(data.venues);
    } catch (error) {
      console.error('Failed to fetch venues:', error);
    }
  };

  useEffect(() => {
    fetchPage();
  }, [citySlug]);

  const city = CITIES.find(c => c.slug === citySlug);

  if (!city) {
    return <p>City not found</p>;
  }

  return (
    <main className="city">
      <h1 className="city-title">{city.label}</h1>
      <Link to="/" className="city-back">Back to Home</Link>
      <div className="city-venues">
        {venues.map(venue => (
          <VenueCard key={venue.id} venue={venue} />
        ))}
      </div>
    </main>
  );
}