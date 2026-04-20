import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import Sidebar from '../components/Sidebar/Sidebar';
import Feed from '../components/Feed/Feed';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-layout">
      <Navbar />
      <div className="home-main">
        <Sidebar />
        <Feed />
      </div>
    </div>
  );
};

export default Home;
