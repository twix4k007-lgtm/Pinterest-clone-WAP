// src/components/ScrollToTop/ScrollToTop.jsx
//
// A floating scroll-to-top button that appears when the user
// has scrolled more than 400px down the feed container.
// Clicking it smoothly scrolls back to the top of the page.

import React, { useState, useEffect } from 'react';
import './ScrollToTop.css';

const SCROLL_THRESHOLD = 400; // px before the button appears

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  // --------------------------------------------------------------------------
  // Listen to window scroll to toggle visibility
  // --------------------------------------------------------------------------
  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > SCROLL_THRESHOLD);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --------------------------------------------------------------------------
  // Smooth scroll handler
  // --------------------------------------------------------------------------
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Don't render the DOM node at all when not visible (performance)
  if (!visible) return null;

  return (
    <button
      id="scroll-to-top-btn"
      className="scroll-to-top-btn"
      onClick={scrollToTop}
      aria-label="Scroll back to top"
      title="Back to top"
    >
      ↑
    </button>
  );
};

export default ScrollToTop;
