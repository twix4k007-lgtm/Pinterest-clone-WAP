import React, { useState, useEffect, useRef } from 'react';
import { searchPins } from '../../services/pinService';
import './SearchBar.css';

const SearchBar = () => {
  const [searchInput, setSearchInput] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced execution of simulated search API
  useEffect(() => {
    if (!searchInput.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const data = await searchPins(searchInput, 5);
        setResults(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  return (
    <div className="search-bar-container" ref={dropdownRef}>
      <input
        type="text"
        className="search-input"
        placeholder="Search for ideas..."
        value={searchInput}
        onChange={(e) => {
          setSearchInput(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
      />
      {showDropdown && searchInput && (
        <div className="search-dropdown">
          {isSearching ? (
            <div className="search-dropdown-item text-muted">Searching...</div>
          ) : results.length > 0 ? (
            results.map((pin) => (
              <div key={pin.id} className="search-dropdown-item">
                <img src={pin.image} alt="" className="search-thumb" />
                <span>{pin.title}</span>
              </div>
            ))
          ) : (
            <div className="search-dropdown-item text-muted">No ideas found. Try "Nature"</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
