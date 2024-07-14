import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const Home = (props) => {
  return (
    <div className="landingPage">
      <div className="mainContainer">
        <div className="titleContainer">
          <h1>Welcome to your Task Manager app!</h1>
        </div>
        <div className="subTitle">Your journey starts here.</div>
        <Link to="/register" className="getStartedButton">Get Started</Link>

      </div>
    </div>
  );
};

export default Home;
