// src/pages/Home.jsx
//
// EXTENDED: Added the ScrollToTop floating button as a page-level global element.
// It lives at the top of the page tree so its fixed positioning is reliable
// regardless of which component is scrolling.

import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import Sidebar from '../components/Sidebar/Sidebar';
import Feed from '../components/Feed/Feed';
import ScrollToTop from '../components/ScrollToTop/ScrollToTop';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-layout">
      <Navbar />
      <div className="home-main">
        <Sidebar />
        <Feed />
      </div>
      {/* Global floating button – rendered outside Feed so it
          persists across both the default and search result views */}
      <ScrollToTop />
    </div>
  );
};

export default Home;
