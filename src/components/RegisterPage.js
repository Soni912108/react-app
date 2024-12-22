import React, { useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import '../App.css';


const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const navigate = useNavigate(); // Import and use useNavigate hook
  const [errorMessage, setErrorMessage] = useState(null); // State to store error message
  const [isLoading, setIsLoading] = useState(false);



  const checkPasswordStrength = (password) => {
    const hasCapitalLetter = /[A-Z]/.test(password);
    const hasSymbol = /[!@#$%^&*()]/.test(password);
    const hasNumber = /\d/.test(password);
    const isLongEnough = password.length >= 10;
  
    return hasCapitalLetter && hasSymbol && hasNumber && isLongEnough;
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    if (!emailRegex.test(email)) {
      alert('Invalid email format');
      return;
    }

    const isStrongPassword = checkPasswordStrength(password);
      if (!isStrongPassword) {
        alert('Password must be at least 10 characters and contain a capital letter, a symbol, and a number!');
        return; // Early return if password is weak
      }
    
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_APP_API_URL}/api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
          confirmPassword,
        }),
      });

      const data = await response.json(); // Parse the response as JSON

      if (data.success) {
        navigate('/tasks');
        setRegisterSuccess(true); // Set flag for successful registration
        // Store the token in localStorage
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('loggedInUserId', username);
      } else {
        setErrorMessage(data.message); // Set error message from response
        console.error('Registration failed:', data.error);
      }
    } catch (error) {
      setErrorMessage(error); // Set error message from response
      console.error('Error registering user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseErrorMessage = () => {
    setErrorMessage(null); // Set error message state to null to hide it
  };

  useEffect(() => {
    if (errorMessage) {
      const timeout = setTimeout(() => setErrorMessage(null), 3000); // Set timeout for 3 seconds
      return () => clearTimeout(timeout); // Cleanup function to clear timeout on unmount
    }
  }, [errorMessage]); // Only run when errorMessage changes


  const handleLoginClick = () => {
    navigate('/login');
  };

  if (isLoading) {
    return <p className="loading-message">Loading...</p>;
  }


  return (
    <div className="registerPage">
      <div className="second">
        <form onSubmit={handleSubmit} className="w-full max-w-md bg-white rounded-lg shadow-lg px-8 py-10">
          <h2 className="text-3xl font-bold text-center mb-8 text-blue-600">Register</h2>
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
              <p>Password must be at least 10 characters containing: a capital letter, a symbol, a number</p>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-blue-500 focus:ring-2"
              />
              <div className="text-red-500 text-sm mt-2">
                {!checkPasswordStrength(password) && "Password is weak!"}
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700 mb-2">Confirm Password:</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-blue-500 focus:ring-2"
              />
            </div>
          </div>
          <button type="submit" className="w-full mt-6 bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200">
            Register
          </button>
          <p className="text-center text-gray-500 mt-4">
            Already have an account? <button type="button" onClick={handleLoginClick} className="text-blue-600 hover:underline">Login</button>
          </p>
        </form>
        {registerSuccess && <p className="text-green-500 text-center mt-4">Registration Successful!</p>}
        {errorMessage && (
        <p className="error-message-register">
          {errorMessage}
          <button type="button" onClick={handleCloseErrorMessage} className="close-button-register">&times;</button>
        </p>
      )}
      </div>
    </div>
  );
  
};

export default RegisterPage;
