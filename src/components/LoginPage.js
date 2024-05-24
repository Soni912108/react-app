import React, { useState,useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import '../App.css';


const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Import and use useNavigate hook
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null); // State to store error message
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation to ensure username and password are not empty
    if (!username || !password) {
      alert('Username or password is empty!');
      return; // Prevent submitting the request
    }

    try {
      const response = await fetch(`https://express-app-pied.vercel.app/login`, {
        method: 'POST', // Use POST for sending user data
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });
  
      const data = await response.json(); // Parse the response as JSON
  
      if (data.success) {
        console.log('User logged in successfully!');
        setLoginSuccess(true);
        // Store the token in localStorage
        localStorage.setItem('userToken', data.token);
        navigate('/tasks');
      } else {
        setErrorMessage(data.message); // Set error message from response
        console.error('Logging in failed:', data.error);
      }
    } catch (error) {
      console.error('Error logging the user:', error);
      setErrorMessage('An unexpected error occurred.'); // Set generic message for unexpected errors
    }
  };
  
  const handleCloseErrorMessage = () => {
    setErrorMessage(null); // Set error message state to null to hide it
  };
  

  const handleRegisterClick = () => {
    navigate('/register');
  };


  useEffect(() => {
    if (errorMessage) {
      const timeout = setTimeout(() => setErrorMessage(null), 3000); // Set timeout for 3 seconds
      return () => clearTimeout(timeout); // Cleanup function to clear timeout on unmount
    }
  }, [errorMessage]); // Only run when errorMessage changes
  

  return (
    <div className="loginPage">
      <div className="second">
        <form onSubmit={handleSubmit} className="w-full max-w-md bg-white rounded-lg shadow-lg px-8 py-10">
          <h2 className="text-3xl font-bold text-center mb-8 text-blue-600">Login</h2>
          <div className="space-y-6">
            <div className="flex flex-col">
              <label className="text-gray-700 mb-2">Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-blue-500 focus:ring-2"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700 mb-2">Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-blue-500 focus:ring-2"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700 mb-2">Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-blue-500 focus:ring-2"
              />
            </div>
          </div>
          <button type="submit" className="w-full mt-6 bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200">
            Login
          </button>
          <p className="text-center text-gray-500 mt-4">
            Don't have an account? <button type="button" onClick={handleRegisterClick} className="link-button">Register</button>
          </p>
        </form>
        {loginSuccess && <p className="text-green-500 text-center mt-4">Login Successful!</p>}
        {errorMessage && (
        <p className="error-message">
          {errorMessage}
          <button type="button" onClick={handleCloseErrorMessage} className="close-button">&times;</button>
        </p>
      )}
      </div>
    </div>
  );
};

export default LoginPage;