import './VenueCard.css'
import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthProvider';

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
    const { user, favorites, like, unlike } = useAuth() || {};
    const [showTip, setShowTip] = useState(false);
    useEffect(() => {
      let t;
      if (showTip) t = setTimeout(() => setShowTip(false), 2000);
      return () => clearTimeout(t);
    }, [showTip]);
    const {
      name,
      website,
      phone,
      address,
      happyHour,
    } = venue

    const seed = name || address || 'venue'
    const imgSrc = pickUniqueImage(seed);
    const id = venue._id;
    const isLiked = !!id && Array.isArray(favorites) && favorites.includes(id);

    const handleToggleLike = async () => {
      if (!id) return;
      if (!user) { setShowTip(true); return; }
      if (isLiked) {
        await unlike(id);
      } else {
        await like(id);
      }
    };
  
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

          <div className="venue-card-actions tooltip-container">
            <button
              type="button"
              className={`like-btn${isLiked ? ' liked' : ''}`}
              aria-pressed={isLiked}
              aria-label={isLiked ? 'Unlike' : 'Like'}
              title={user ? (isLiked ? 'Unlike' : 'Like') : 'Login to like'}
              onClick={handleToggleLike}
              disabled={!id}
            >
              {isLiked ? '♥ Liked' : '♡ Like'}
            </button>
            {!user && showTip && (
              <span role="tooltip" className="tooltip">Log in to like venues</span>
            )}
          </div>
        </div>
      </article>
    )
  }
