import React from 'react';
import PinCard from '../PinCard/PinCard';
import './Feed.css';

// Mock array data
const MOCK_PINS = [
  { id: 1, title: 'Beautiful Nature', image: 'https://via.placeholder.com/300x400' },
  { id: 2, title: 'Minimalist Setup', image: 'https://via.placeholder.com/300x300' },
  { id: 3, title: 'Healthy Recipe', image: 'https://via.placeholder.com/300x500' },
  { id: 4, title: 'Travel Destination', image: 'https://via.placeholder.com/300x200' },
  { id: 5, title: 'DIY Project', image: 'https://via.placeholder.com/300x350' },
  { id: 6, title: 'Fashion Inspiration', image: 'https://via.placeholder.com/300x450' },
  { id: 7, title: 'Tech Gadgets', image: 'https://via.placeholder.com/300x250' },
  { id: 8, title: 'Art & Design', image: 'https://via.placeholder.com/300x320' },
  { id: 9, title: 'Street Photography', image: 'https://via.placeholder.com/300x280' },
  { id: 10, title: 'Vintage Cars', image: 'https://via.placeholder.com/300x380' },
];

const Feed = () => {
  return (
    <div className="feed-container">
      {/* API integration for feed data goes here */}
      <div className="feed-masonry-grid">
        {MOCK_PINS.map((pin) => (
          <PinCard key={pin.id} title={pin.title} image={pin.image} />
        ))}
      </div>
    </div>
  );
};

export default Feed;
