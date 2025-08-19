import './VenueCard.css'
import React from 'react';

const imagePool = Object.values(
    import.meta.glob('../assets/*', { eager: true, import: 'default' })
  )
  
  function pickImage(seed = '') {
    if (imagePool.length === 0) return ''
    let h = 0
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
    return imagePool[h % imagePool.length]
  }
  
  export default function VenueCard({ venue }) {
    const {
      name,
      website,
      phone,
      address,
      happyHour,
    } = venue
  
    const imgSrc = pickImage(name || address || 'venue')
  
    return (
      <article className="venue-card">
        {imgSrc ? (
          <img className="venue-card-img" src={imgSrc} alt="Decorative venue" />
        ) : (
          <div className="venue-card-img placeholder" aria-hidden="true" />
        )}
  
        <div className="venue-card-content">
          <h2 className="venue-card-title">
            {website ? (
              <a href={website} target="_blank" rel="noopener noreferrer">
                {name}
              </a>
            ) : (
              name
            )}
          </h2>
  
          {address && <p className="venue-card-line">{address}</p>}
  
          {phone && (
            <p className="venue-card-line">
              <a href={`tel:${phone.replace(/[^\d+]/g, '')}`}>{phone}</a>
            </p>
          )}
  
          {happyHour && (
            <p className="venue-card-hh">
              <strong>Happy Hour:</strong> {happyHour}
            </p>
          )}
        </div>
      </article>
    )
  }