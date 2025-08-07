import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AppContext } from '../App';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const { fetchUserAndCart } = useContext(AppContext);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    if (!email) return 'Email is required';
    if (email.length < 6) return 'Email is too short';
    if (email.length > 254) return 'Email is too long';

    const [localPart, domain] = email.split('@');

    if (!localPart || !domain) return 'Invalid email format';
    if (localPart.length > 64) return 'Username part is too long';

    // Local part validation
    if (/^[.]|[.]$/.test(localPart)) return 'Email username cannot start or end with a dot';
    if (/[.]{2,}/.test(localPart)) return 'Email username cannot have consecutive dots';
    if (/[^a-zA-Z0-9._-]/.test(localPart)) return 'Email username contains invalid characters';

    // Domain validation
    if (/[^a-zA-Z0-9.-]/.test(domain)) return 'Domain contains invalid characters';
    if (/^[.-]|[.-]$/.test(domain)) return 'Domain cannot start or end with a dot or hyphen';
    if (!/\./.test(domain)) return 'Domain must contain at least one dot';
    if (/[.]{2,}/.test(domain)) return 'Domain cannot have consecutive dots';

    // const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) return 'Invalid email format';

    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (password.length > 50) return 'Password is too long';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
    if (!/[!@#$%^&*]/.test(password)) return 'Password must contain at least one special character (!@#$%^&*)';
    return '';
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setEmailError(validateEmail(newEmail));
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordError(validatePassword(newPassword));
    if (confirmPassword) {
      setConfirmPasswordError(newPassword !== confirmPassword ? 'Passwords do not match' : '');
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    setConfirmPasswordError(password !== newConfirmPassword ? 'Passwords do not match' : '');
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate all fields
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const confirmError = password !== confirmPassword ? 'Passwords do not match' : '';

    setEmailError(emailError);
    setPasswordError(passwordError);
    setConfirmPasswordError(confirmError);

    if (emailError || passwordError || confirmError) {
      return;
    }

    try {
      // Show loading, success, or error toast appropriately
      await toast.promise(
        axios.post('/auth/register', { email, password }),
        {
          loading: 'Registering...',
          success: 'Registration successful!',
          error: (err) => err.response?.data?.message || 'Registration failed',
        }
      );

      await fetchUserAndCart();
      navigate('/');
    } catch (error) {
      // No extra toast here — already handled above
      setEmailError(error.response?.data?.message || 'Registration failed');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/auth/google';
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
        <form onSubmit={handleRegister} noValidate>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="text"  // ✅ stops native email popup
              value={email}
              onChange={handleEmailChange}
              className={`w-full px-3 py-2 border rounded-lg ${emailError ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Email"
            />
            {emailError && (
              <p className="text-red-500 text-sm mt-1">{emailError}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              className={`w-full px-3 py-2 border rounded-lg ${passwordError ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder='Password'
              required
            />
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
          </div>
          <div className="mb-6">
            <label className="block text-gray-700">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              className={`w-full px-3 py-2 border rounded-lg ${confirmPasswordError ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder='Confirm Password'
              required
            />
            {confirmPasswordError && (
              <p className="text-red-500 text-sm mt-1">{confirmPasswordError}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Register
          </button>
        </form>
        <div className="text-center my-4">OR</div>
        <button 
          onClick={handleGoogleLogin} 
          className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
        >
          Continue with Google
        </button>
        <p className="text-center mt-4">
          Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;