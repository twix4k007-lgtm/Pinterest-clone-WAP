// src/context/SearchContext.jsx
//
// Provides a globally shared search state via React Context.
// Any component in the tree can read or update the search query,
// results, loading state, error state, and recent searches
// without prop-drilling through intermediate layers.

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { searchPins, getPins } from '../services/pinService';

// --------------------------------------------------------------------------
// Context Definition
// --------------------------------------------------------------------------
const SearchContext = createContext(null);

// Max number of recent searches to retain in memory
const MAX_RECENT_SEARCHES = 3;

// --------------------------------------------------------------------------
// SearchProvider
// Wraps your component tree and exposes search state + actions.
// --------------------------------------------------------------------------
export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQueryRaw] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Tracks the last N distinct search terms the user has submitted
  const [recentSearches, setRecentSearches] = useState([]);

  // Ref to hold the current debounce timer so we can cancel it on re-type
  const debounceTimer = useRef(null);

  /**
   * addRecentSearch
   * Prepends a new term to the recent searches list.
   * Deduplicates and enforces the MAX_RECENT_SEARCHES cap.
   *
   * @param {string} term - The search term to record
   */
  const addRecentSearch = useCallback((term) => {
    if (!term || !term.trim()) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s.toLowerCase() !== term.toLowerCase());
      return [term.trim(), ...filtered].slice(0, MAX_RECENT_SEARCHES);
    });
  }, []);

  /**
   * removeRecentSearch
   * Removes a single term from the recent searches list.
   *
   * @param {string} term - The search term to remove
   */
  const removeRecentSearch = useCallback((term) => {
    setRecentSearches((prev) => prev.filter((s) => s !== term));
  }, []);

  /**
   * clearRecentSearches
   * Wipes the entire recent searches history.
   */
  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
  }, []);

  /**
   * executeSearch
   * Fires the actual API call with the given query.
   * Called directly (Enter key) or after debounce delay.
   *
   * @param {string} query - The search term to execute
   */
  const executeSearch = useCallback(async (query) => {
    const trimmed = query.trim();

    // Empty query → revert to default feed
    if (!trimmed) {
      setLoading(true);
      setError(null);
      try {
        const data = await getPins(1, 20);
        setResults(data);
      } catch (err) {
        setError('Failed to load pins. Please try again.');
        console.error('[SearchContext] Default feed error:', err);
      } finally {
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await searchPins(trimmed, 30);
      setResults(data);
      // Record this term in recent searches on a successful fetch
      addRecentSearch(trimmed);
    } catch (err) {
      setError('Search failed. Please try again in a moment.');
      console.error('[SearchContext] Search error:', err);
    } finally {
      setLoading(false);
    }
  }, [addRecentSearch]);

  /**
   * setSearchQuery
   * Updates the displayed query string AND triggers a debounced search
   * (~300ms). This is what SearchBar should call on every keystroke.
   *
   * @param {string} query - Raw input value from the search field
   */
  const setSearchQuery = useCallback((query) => {
    setSearchQueryRaw(query);

    // Cancel any pending debounce from a previous keystroke
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Schedule a fresh search 300ms after the user stops typing
    debounceTimer.current = setTimeout(() => {
      executeSearch(query);
    }, 300);
  }, [executeSearch]);

  /**
   * clearSearch
   * Resets everything – query, results, errors – and reloads default pins.
   */
  const clearSearch = useCallback(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    setSearchQueryRaw('');
    setError(null);
    // Trigger a full clear which also reloads the default feed
    executeSearch('');
  }, [executeSearch]);

  // The value bag exposed to all consuming components
  const contextValue = {
    searchQuery,
    setSearchQuery,
    results,
    loading,
    error,
    recentSearches,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
    executeSearch,
    clearSearch,
  };

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  );
};

// --------------------------------------------------------------------------
// useSearch – Custom hook for consuming search context
// Throws a descriptive error if used outside a SearchProvider.
// --------------------------------------------------------------------------
export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error(
      '[useSearch] Must be used inside a <SearchProvider>. ' +
      'Wrap your App (or the relevant subtree) with <SearchProvider>.'
    );
  }
  return context;
};

export default SearchContext;
