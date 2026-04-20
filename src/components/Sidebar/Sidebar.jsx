import React from 'react';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <ul className="sidebar-menu">
        <li className="sidebar-item active">Home</li>
        <li className="sidebar-item">Explore</li>
        <li className="sidebar-item">Profile</li>
      </ul>
    </aside>
  );
};

export default Sidebar;
