// src/hooks/useInfiniteScroll.js
import { useState, useEffect, useCallback } from 'react';

/**
 * ----------------------------------------------------------------------------
 * useInfiniteScroll HOOK
 * ----------------------------------------------------------------------------
 * An advanced hook enabling endless scrolling behavior for feeds. 
 * Connects to a standard browser IntersectionObserver to trigger next page loads 
 * just before the user hits the absolute bottom of the container.
 * 
 * @param {Function} loadMoreCallback - Function to execute when reaching bottom
 * @param {boolean} hasMore - Flag indicating if there's more data to fetch
 * @param {boolean} isLoading - Prevents double fetching if already in flight
 * @param {Object} options - Configuration for IntersectionObserver
 * @returns {Array} [Ref object to measure, boolean indicating if currently loading more]
 */
export const useInfiniteScroll = (loadMoreCallback, hasMore, isLoading, options = { threshold: 0.5 }) => {
  const [observerNode, setObserverNode] = useState(null);

  const observerRef = useCallback((node) => {
    if (isLoading) return;
    
    setObserverNode(node);
  }, [isLoading]);

  useEffect(() => {
    if (!observerNode || !hasMore) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !isLoading) {
        loadMoreCallback();
      }
    }, options);

    observer.observe(observerNode);

    return () => {
      if (observerNode) {
        observer.unobserve(observerNode);
      }
    };
  }, [observerNode, hasMore, isLoading, loadMoreCallback, options]);

  return [observerRef];
};

export default useInfiniteScroll;
