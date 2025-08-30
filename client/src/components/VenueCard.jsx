import './VenueCard.css'
import React from 'react';

const imagePool = Object.values(
    import.meta.glob('../assets/*', { eager: true, import: 'default' })
  )
  
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  
  const _assigned = new Map();      // seed -> image src
  let _queue = [];                  // remaining images in the current cycle
  
  function nextImage() {
    if (imagePool.length === 0) return '';
    if (_queue.length === 0) _queue = shuffle(imagePool); // start a fresh cycle
    return _queue.pop();
  }
  
  function pickUniqueImage(seed = '') {
    if (!_assigned.has(seed)) {
      _assigned.set(seed, nextImage());
    }
    return _assigned.get(seed);
  }
  
  export default function VenueCard({ venue }) {
    const {
      name,
      website,
      phone,
      address,
      happyHour,
    } = venue
  
    const seed = name || address || 'venue'
    const imgSrc = pickUniqueImage(seed);
  
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