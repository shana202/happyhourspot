import './VenueCard.css'
import React from 'react';

export default function VenueCard({ venue }) {
  return (
    <div className="venue-card">
      <h2 className="venue-name">{venue.name}</h2>
      <p className="venue-address">{venue.address}</p>
      <p className="venue-hours">Happy Hour: {venue.happy_hour}</p>
    </div>
  );
}