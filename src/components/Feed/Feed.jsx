// src/components/Feed/Feed.jsx
//
// EXTENDED: Now reads from global SearchContext.
// Behaviour:
//   - Default (no query): shows paginated pins with infinite scroll.
//   - Active query: shows search results from context.
//   - Loading: renders shimmer skeleton cards.
//   - Empty: renders "No results" UI with suggestion text.
//   - Error: renders friendly error UI with retry button.

import React, { useState, useEffect, useCallback } from 'react';
import PinCard from '../PinCard/PinCard';
import PinModal from '../PinModal/PinModal';
import { getPins } from '../../services/pinService';
import { useSearch } from '../../context/SearchContext';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import './Feed.css';

// --------------------------------------------------------------------------
// SkeletonGrid – shared placeholder loader used in multiple loading states
// --------------------------------------------------------------------------
const SkeletonGrid = ({ count = 20 }) => (
  <div className="skeleton-grid">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="skeleton-card" />
    ))}
  </div>
);

// --------------------------------------------------------------------------
// Feed Component
// --------------------------------------------------------------------------
const Feed = () => {
  // ---- Context: global search state ----
  const { searchQuery, results, loading: searchLoading, error: searchError, executeSearch } = useSearch();

  // ---- Local state: default (non-search) paginated feed ----
  const [defaultPins, setDefaultPins] = useState([]);
  const [defaultLoading, setDefaultLoading] = useState(true);
  const [defaultError, setDefaultError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // ---- Modal state ----
  const [selectedPin, setSelectedPin] = useState(null);

  // --------------------------------------------------------------------------
  // Initial feed load (fires once on mount)
  // --------------------------------------------------------------------------
  const fetchInitialPins = async () => {
    try {
      setDefaultLoading(true);
      const data = await getPins(1, 20);
      setDefaultPins(data);
      setPage(2);
    } catch (err) {
      setDefaultError('We ran into an issue connecting to our servers. Please try refreshing.');
      console.error('[Feed] Initial load error:', err);
    } finally {
      setDefaultLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialPins();
    // Prime the search context with default results so Feed never starts empty
    executeSearch('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --------------------------------------------------------------------------
  // Infinite scroll callback (only active in default/non-search mode)
  // --------------------------------------------------------------------------
  const fetchMorePins = useCallback(async () => {
    if (loadingMore || !hasMore || searchQuery) return;

    try {
      setLoadingMore(true);
      const data = await getPins(page, 10);

      if (data.length === 0) {
        setHasMore(false);
      } else {
        // Append newly loaded pins to the existing list
        setDefaultPins((prev) => [...prev, ...data]);
        setPage((prev) => prev + 1);
      }
    } catch (err) {
      console.warn('[Feed] Pagination error handled silently:', err);
    } finally {
      setLoadingMore(false);
    }
  }, [page, loadingMore, hasMore, searchQuery]);

  const [infiniteRef] = useInfiniteScroll(fetchMorePins, hasMore && !searchQuery, loadingMore, {
    threshold: 0.1,
  });

  // --------------------------------------------------------------------------
  // Decide what to render based on active mode (search vs default)
  // --------------------------------------------------------------------------

  // --- SEARCH MODE ---
  if (searchQuery) {
    // Search is in-flight
    if (searchLoading) {
      return (
        <div className="feed-container">
          <div className="feed-search-label">
            Searching for <em>"{searchQuery}"</em>…
          </div>
          <SkeletonGrid count={12} />
        </div>
      );
    }

    // Search returned an error
    if (searchError) {
      return (
        <div className="feed-container">
          <div className="status-state error">
            <span className="status-icon" aria-hidden="true">⚠️</span>
            <h3>Search failed</h3>
            <p>{searchError}</p>
          </div>
        </div>
      );
    }

    // Search returned zero results
    if (results.length === 0) {
      return (
        <div className="feed-container">
          <div className="status-state empty no-results">
            <span className="status-icon" aria-hidden="true">🔍</span>
            <h3>No results for "{searchQuery}"</h3>
            <p>
              We couldn't find any pins matching that search. Try a different
              keyword like <strong>"nature"</strong>, <strong>"food"</strong>, or{' '}
              <strong>"travel"</strong>.
            </p>
            <div className="no-results-suggestions">
              {['Nature', 'Art', 'Food', 'Travel', 'Tech'].map((tag) => (
                <button
                  key={tag}
                  className="suggestion-chip"
                  onClick={() => {/* handled by SearchBar context */}}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Search succeeded – render results with smooth fade-in
    return (
      <div className="feed-container" key="search-results">
        <div className="feed-search-label">
          <strong>{results.length}</strong> results for <em>"{searchQuery}"</em>
        </div>
        <div className="feed-masonry-grid feed-results-enter">
          {results.map((pin, index) => (
            <PinCard
              key={`search-${pin.id}-${index}`}
              title={pin.title}
              image={pin.image}
              author={pin.author}
              likes={pin.likes}
              comments={pin.comments}
              tags={pin.tags}
              onClick={() => setSelectedPin(pin)}
            />
          ))}
        </div>

        {/* Modal overlay */}
        {selectedPin && (
          <PinModal pin={selectedPin} onClose={() => setSelectedPin(null)} />
        )}
      </div>
    );
  }

  // --- DEFAULT FEED MODE ---

  // Initial load skeleton
  if (defaultLoading) {
    return (
      <div className="feed-container">
        <SkeletonGrid count={20} />
      </div>
    );
  }

  // Default feed error with retry
  if (defaultError) {
    return (
      <div className="feed-container">
        <div className="status-state error">
          <span className="status-icon" aria-hidden="true">⚡</span>
          <h3>Oops! Something went wrong.</h3>
          <p>{defaultError}</p>
          <button
            className="retry-btn"
            onClick={() => {
              setDefaultError(null);
              fetchInitialPins();
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Default feed empty (should rarely happen with mock data)
  if (defaultPins.length === 0) {
    return (
      <div className="feed-container">
        <div className="status-state empty">
          <span className="status-icon" aria-hidden="true">📌</span>
          <h3>No ideas found</h3>
          <p>Try searching for something! We regularly add new inspiration.</p>
        </div>
      </div>
    );
  }

  // Default feed – full masonry layout with infinite scroll
  return (
    <div className="feed-container">
      <div className="feed-masonry-grid">
        {defaultPins.map((pin, index) => (
          <PinCard
            key={`${pin.id}-${index}`}
            title={pin.title}
            image={pin.image}
            author={pin.author}
            likes={pin.likes}
            comments={pin.comments}
            tags={pin.tags}
            onClick={() => setSelectedPin(pin)}
          />
        ))}
      </div>

      {/* Invisible scroll sentinel – triggers IntersectionObserver */}
      {hasMore && (
        <div ref={infiniteRef} className="infinite-scroll-loader">
          {loadingMore && <div className="shimmer-dot" />}
        </div>
      )}

      {/* Immersive pin detail modal */}
      {selectedPin && (
        <PinModal pin={selectedPin} onClose={() => setSelectedPin(null)} />
      )}
    </div>
  );
};

export default Feed;
