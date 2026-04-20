// src/components/PinCard/PinCard.jsx
//
// EXTENDED:
//   - "Save" button now toggles between saved / unsaved state (UI only).
//     The visual treatment changes to reflect the post-save confirmation.
//   - Tags are accepted as props and displayed as small chips below the title.
//   - The save action is e.stopPropagation()-isolated so it doesn't open the modal.
//   - Author avatar uses a seed based on author name for visual variety.

import React, { useState } from 'react';
import './PinCard.css';

const PinCard = ({ image, title, author, likes, comments, tags = [], onClick }) => {
  // Local toggle state – in a real app this would be persisted via API
  const [saved, setSaved] = useState(false);

  /**
   * handleSave
   * Toggles the saved state without propagating the click to the card's
   * onClick handler (which would open the detail modal).
   */
  const handleSave = (e) => {
    e.stopPropagation(); // Prevent opening the PinModal
    setSaved((prev) => !prev);
  };

  // Generate a deterministic but varied avatar colour seed from author name
  const avatarSeed = encodeURIComponent(author || 'Anonymous');

  return (
    <div
      className="pin-card"
      tabIndex="0"
      role="button"
      aria-label={`View pin: ${title}`}
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
          {/* Save button with saved/unsaved visual states */}
          <button
            className={`pin-save-btn ${saved ? 'pin-save-btn--saved' : ''}`}
            onClick={handleSave}
            aria-label={saved ? `Unsave ${title}` : `Save ${title}`}
            aria-pressed={saved}
          >
            {saved ? '✓ Saved' : 'Save'}
          </button>

          <div className="pin-overlay-footer">
            <button className="pin-action-btn" aria-label="Share">↗</button>
            <button className="pin-action-btn" aria-label="More Options">⋯</button>
          </div>
        </div>
      </div>

      <div className="pin-details">
        <h3 className="pin-title">{title}</h3>

        {/* Render category tags if provided */}
        {tags.length > 0 && (
          <div className="pin-tags" aria-label="Tags">
            {tags.slice(0, 2).map((tag) => (
              <span key={tag} className="pin-tag">#{tag}</span>
            ))}
          </div>
        )}

        <div className="pin-meta">
          <div className="pin-author">
            {/* Avatar URL seeded from author name for variety */}
            <div
              className="pin-author-avatar"
              style={{
                backgroundImage: `url(https://ui-avatars.com/api/?name=${avatarSeed}&background=random&color=fff&size=24)`,
              }}
              aria-hidden="true"
            />
            <span>{author || 'Anonymous'}</span>
          </div>

          <div className="pin-stats">
            {!!likes && (
              <span className="pin-stat-item" aria-label={`${likes} likes`}>
                ♥ {likes}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinCard;
