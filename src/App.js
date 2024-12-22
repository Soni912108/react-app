import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import TaskForm from './components/TaskManager';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import EditTaskForm from './components/EditTaskForm';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [isTokenChecked, setIsTokenChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
      setLoggedIn(true);
    }
    setIsTokenChecked(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    setLoggedIn(false);
    setEmail('');
  };

  if (!isTokenChecked) {
    return <div>Loading...</div>; // Show a loading state while checking the token
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage email={email} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />} />
          <Route path="/login" element={<LoginPage setLoggedIn={setLoggedIn} setEmail={setEmail} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/tasks" element={loggedIn ? <TaskForm /> : <Navigate to="/login" />} />
          <Route path="/tasks/:taskId/edit" element={loggedIn ? <EditTaskForm /> : <Navigate to="/login" />} />
          <Route path="*" element={<div>404 Not Found</div>} /> {/* Fallback for unknown routes */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
