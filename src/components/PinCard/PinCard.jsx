import React from 'react';
import './PinCard.css';

const PinCard = ({ image, title, author, likes, comments, onClick }) => {
  return (
    <div 
      className="pin-card" 
      tabIndex="0" 
      role="button" 
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="pin-image-wrapper">
        <img src={image} alt={title} className="pin-image" loading="lazy" />
        {/* Hover overlay injected cleanly over the image */}
        <div className="pin-overlay">
           <button className="pin-save-btn">Save</button>
           <div className="pin-overlay-footer">
             <button className="pin-action-btn" aria-label="Share">↗</button>
             <button className="pin-action-btn" aria-label="More Options">⋯</button>
           </div>
        </div>
      </div>
      <div className="pin-details">
        <h3 className="pin-title">{title}</h3>
        <div className="pin-meta">
          <div className="pin-author">
            <div className="pin-author-avatar"></div>
            <span>{author || 'Anonymous'}</span>
          </div>
          <div className="pin-stats">
            {likes && <span className="pin-stat-item" aria-label={`${likes} likes`}>♥ {likes}</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinCard;
