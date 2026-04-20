import React from 'react';
import './PinCard.css';

const PinCard = ({ image, title }) => {
  return (
    <div className="pin-card">
      <div className="pin-image-wrapper">
        <img src={image} alt={title} className="pin-image" />
      </div>
      <div className="pin-title">
        <p>{title}</p>
      </div>
    </div>
  );
};

export default PinCard;
