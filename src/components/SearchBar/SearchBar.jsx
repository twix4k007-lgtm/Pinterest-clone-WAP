import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = () => {
  const [searchInput, setSearchInput] = useState('');

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    // API search integration goes here
  };

  return (
    <div className="search-bar-container">
      <input
        type="text"
        className="search-input"
        placeholder="Search..."
        value={searchInput}
        onChange={handleSearchChange}
      />
    </div>
  );
};

export default SearchBar;
