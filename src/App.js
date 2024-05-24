import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import ProductForm from './components/TaskManager'; // Import the TaskManager component
import LandingPage from './components/LandingPage'; // Import LandingPage component 
import LoginPage from './components/LoginPage'; // Import LoginPage component 
import RegisterPage from './components/RegisterPage'; // Import RegisterPage component
import EditTaskForm from './components/EditTaskForm'; // Import RegisterPage component
import { useState } from 'react'


function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [email, setEmail] = useState('')
  const isLoggedIn = localStorage.getItem('userToken'); // Check for stored token

  return (
    <Router>
      <div className="App">
        <Routes>
        <Route path="/" element={<LandingPage email={email} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />} />
        <Route path="/login" element={<LoginPage setLoggedIn={setLoggedIn} setEmail={setEmail} />} />
          <Route path="/register" element={<RegisterPage />} />
          {isLoggedIn && <Route path="/tasks" element={<ProductForm />} />}
        <Route path="/tasks/:taskId/edit" element={<EditTaskForm />} />
        </Routes>
      </div>
    </Router>
  );
}



export default App;
