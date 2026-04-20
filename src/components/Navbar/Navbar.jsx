import React from 'react';
import SearchBar from '../SearchBar/SearchBar';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span className="logo-placeholder">P</span>
      </div>
      <div className="navbar-search">
        <SearchBar />
      </div>
      <div className="navbar-profile">
        <div className="profile-icon"></div>
      </div>
    </nav>
  );
};

export default Navbar;
