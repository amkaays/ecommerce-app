import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AppContext } from '../App';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');
  const { fetchUserAndCart } = useContext(AppContext);
  const navigate = useNavigate();

  const validateForm = () => {
  let isValid = true;

  if (!email) {
    setEmailError('Email is required');
    isValid = false;
  } else {
    setEmailError('');
  }

  if (!password) {
    setPasswordError('Password is required');
    isValid = false;
  } else {
    setPasswordError('');
  }

  return isValid;
};
useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const googleSuccess = urlParams.get('googleSuccess');
    
   if (googleSuccess === 'true') {
      toast.success('Login successful!');  // Add this line back
      setTimeout(() => {
      navigate('/', { replace: true });
      }, 1000);
    }
  }, [navigate]);

  
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');

    if (!validateForm()) {
      return;
    }

    try {
      await axios.post('/auth/login', { email, password });
      await fetchUserAndCart();
      toast.success('Login successful!');
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error) {
      setLoginError(error.response?.data?.message || 'Invalid email or password');
    }
  };

  const handleGoogleLogin = () => {
    toast.loading('Redirecting to Google login...', {
      duration: 2000,
    });
    window.location.href = 'http://localhost:3000/auth/google';
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleLogin} noValidate>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError('');
                setLoginError('');
              }} 
              className={`w-full px-3 py-2 border rounded-lg ${
                emailError ? 'border-red-500' : 'border-gray-300'
              }`} 
              placeholder='Email'
            />
            {emailError && (
              <p className="text-red-500 text-sm mt-1">{emailError}</p>
            )}
          </div>
          <div className="mb-6">
            <label className="block text-gray-700">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError('');
                setLoginError('');
              }} 
              className={`w-full px-3 py-2 border rounded-lg ${
                passwordError ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder='Password'
            />
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
          </div>
          {loginError && (
            <p className="text-red-500 text-sm mb-4 text-center">{loginError}</p>
          )}
          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Login
          </button>
        </form>
        <div className="text-center my-4">OR</div>
        <button 
          onClick={handleGoogleLogin} 
          className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
        >
          Contiune with Google
        </button>
        <p className="text-center mt-4">
          Don't have an account? <Link to="/register" className="text-blue-500 hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;