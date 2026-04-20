// src/components/SearchBar/SearchBar.jsx
//
// EXTENDED: Now connected to global SearchContext.
// Features added:
//   - Live search driven by context (debounced ~300ms via context)
//   - Clear (X) button to reset query + results
//   - Enter key fires immediate search
//   - Escape key clears the field
//   - Recent searches shown in dropdown when input is focused but empty
//   - Inline search icon for polished look

import React, { useRef, useState, useEffect } from 'react';
import { useSearch } from '../../context/SearchContext';
import './SearchBar.css';

const SearchBar = () => {
  const {
    searchQuery,
    setSearchQuery,
    executeSearch,
    clearSearch,
    recentSearches,
    removeRecentSearch,
    clearRecentSearches,
  } = useSearch();

  // Local UI state – controls dropdown visibility only
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // --------------------------------------------------------------------------
  // Click-outside handler: close dropdown when user clicks away
  // --------------------------------------------------------------------------
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --------------------------------------------------------------------------
  // Handlers
  // --------------------------------------------------------------------------

  /** Called on every keystroke – delegates debounce logic to context */
  const handleChange = (e) => {
    setSearchQuery(e.target.value);
    setShowDropdown(true);
  };

  /**
   * Keyboard shortcuts:
   *  Enter → fire immediate search (bypassing the debounce timer)
   *  Escape → clear search and close dropdown
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setShowDropdown(false);
      executeSearch(searchQuery);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleClear();
    }
  };

  /** Full reset: clears text, results, and closes the dropdown */
  const handleClear = () => {
    clearSearch();
    setShowDropdown(false);
    inputRef.current?.focus(); // Keep focus on the field after clearing
  };

  /** Clicking a recent search term populates the field and runs the search */
  const handleRecentClick = (term) => {
    setSearchQuery(term);
    setShowDropdown(false);
    executeSearch(term);
  };

  // --------------------------------------------------------------------------
  // Derived state
  // --------------------------------------------------------------------------
  const hasQuery = searchQuery.length > 0;
  // Show the recent-searches panel when focused but no text is typed yet
  const showRecents = showDropdown && !hasQuery && recentSearches.length > 0;

  // --------------------------------------------------------------------------
  // Render
  // --------------------------------------------------------------------------
  return (
    <div className="search-bar-container" ref={containerRef}>
      {/* Search icon — purely decorative */}
      <span className="search-icon" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </span>

      <input
        ref={inputRef}
        id="global-search-input"
        type="text"
        className="search-input"
        placeholder="Search for ideas..."
        value={searchQuery}
        autoComplete="off"
        aria-label="Search pins"
        onChange={handleChange}
        onFocus={() => setShowDropdown(true)}
        onKeyDown={handleKeyDown}
      />

      {/* Clear button – only visible when there is text */}
      {hasQuery && (
        <button
          className="search-clear-btn"
          onClick={handleClear}
          aria-label="Clear search"
          title="Clear search (Esc)"
        >
          ✕
        </button>
      )}

      {/* Recent searches panel (shown when focused with no query typed) */}
      {showRecents && (
        <div className="search-dropdown" role="listbox" aria-label="Recent searches">
          <div className="search-dropdown-header">
            <span>Recent searches</span>
            <button
              className="search-clear-recents-btn"
              onClick={clearRecentSearches}
              aria-label="Clear all recent searches"
            >
              Clear all
            </button>
          </div>
          {recentSearches.map((term) => (
            <div
              key={term}
              className="search-dropdown-item recent-item"
              role="option"
              tabIndex="0"
              onClick={() => handleRecentClick(term)}
              onKeyDown={(e) => e.key === 'Enter' && handleRecentClick(term)}
            >
              {/* Clock icon for recent items */}
              <span className="search-recent-icon" aria-hidden="true">🕐</span>
              <span className="search-recent-term">{term}</span>
              {/* Individual remove button for each recent term */}
              <button
                className="search-remove-recent-btn"
                onClick={(e) => {
                  e.stopPropagation(); // Don't trigger the parent click
                  removeRecentSearch(term);
                }}
                aria-label={`Remove "${term}" from recent searches`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
