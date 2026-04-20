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
        // Request a large initial dataset to fill the masonry grid broadly
        const data = await getPins(1, 30);
        setPins(data);
      } catch (err) {
        setError('We ran into an issue connecting to our servers. Please attempt to refresh.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPins();
  }, []);

  if (loading) {
    // Generate empty placeholders to construct our Shimmering Skeleton Loader
    const placeholders = Array.from({ length: 20 });
    return (
      <div className="feed-container">
        <div className="skeleton-grid">
          {placeholders.map((_, i) => (
            <div key={i} className="skeleton-card"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="feed-container">
        <div className="status-state error">
          <h3>Oops! Something went wrong.</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (pins.length === 0) {
    return (
      <div className="feed-container">
        <div className="status-state empty">
          <h3>No ideas found</h3>
          <p>Try searching for something else! We regularly add new inspiration.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="feed-container">
      <div className="feed-masonry-grid">
        {pins.map((pin) => (
          <PinCard 
            key={pin.id} 
            title={pin.title} 
            image={pin.image} 
            author={pin.author}
            likes={pin.likes}
            comments={pin.comments}
          />
        ))}
      </div>
    </div>
  );
};

export default Feed;
