import React, { useState, useEffect } from 'react';
import PinCard from '../PinCard/PinCard';
import { getPins } from '../../services/pinService';
import './Feed.css';

const Feed = () => {
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPins = async () => {
      try {
        setLoading(true);
        const data = await getPins();
        setPins(data);
      } catch (err) {
        setError('Failed to load pins. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPins();
  }, []);

  if (loading) {
    return <div className="feed-container status-state">Loading amazing ideas...</div>;
  }

  if (error) {
    return <div className="feed-container status-state error">{error}</div>;
  }

  if (pins.length === 0) {
    return <div className="feed-container status-state empty">No ideas found. Try another search!</div>;
  }

  return (
    <div className="feed-container">
      <div className="feed-masonry-grid">
        {pins.map((pin) => (
          <PinCard key={pin.id} title={pin.title} image={pin.image} />
        ))}
      </div>
    </div>
  );
};

export default Feed;
