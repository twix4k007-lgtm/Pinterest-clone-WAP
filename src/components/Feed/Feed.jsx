import React, { useState, useEffect, useCallback } from 'react';
import PinCard from '../PinCard/PinCard';
import PinModal from '../PinModal/PinModal';
import { getPins } from '../../services/pinService';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import './Feed.css';

const Feed = () => {
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Focus Mode / Modal State
  const [selectedPin, setSelectedPin] = useState(null);

  const fetchInitialPins = async () => {
    try {
      setLoading(true);
      const data = await getPins(1, 20); // Initial large batch
      setPins(data);
      setPage(2);
    } catch (err) {
      setError('We ran into an issue connecting to our servers. Please attempt to refresh.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialPins();
  }, []);

  // Infinite Scroll Callback Handler
  const fetchMorePins = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    
    try {
      setLoadingMore(true);
      const data = await getPins(page, 10);
      
      if (data.length === 0) {
        setHasMore(false);
      } else {
        // Appending the results. In a real app we'd get diverse results,
        // here we loop the mock data nicely.
        setPins(prev => [...prev, ...data]);
        setPage(prev => prev + 1);
      }
    } catch (err) {
      console.warn('Pagination simulated error handled silently:', err);
    } finally {
      setLoadingMore(false);
    }
  }, [page, loadingMore, hasMore]);

  // Hooking the custom intersection observer logic
  const [infiniteRef] = useInfiniteScroll(fetchMorePins, hasMore, loadingMore, {
    threshold: 0.1
  });

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
        {pins.map((pin, index) => (
          <PinCard 
            key={`${pin.id}-${index}`} // Composite key allows data looping arrays safely
            title={pin.title} 
            image={pin.image} 
            author={pin.author}
            likes={pin.likes}
            comments={pin.comments}
            onClick={() => setSelectedPin(pin)}
          />
        ))}
      </div>

      {/* Invisible (or subtly visible) boundary marking the trigger for IntersectionObserver */}
      {pins.length > 0 && hasMore && (
        <div ref={infiniteRef} className="infinite-scroll-loader">
           {loadingMore ? (
             <div className="shimmer-dot"></div>
           ) : null}
        </div>
      )}

      {/* Immersive View Portal */}
      {selectedPin && (
        <PinModal pin={selectedPin} onClose={() => setSelectedPin(null)} />
      )}
    </div>
  );
};

export default Feed;
