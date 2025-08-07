import React, { useState, useEffect, createContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import ProtectedRoute from './components/ProtectedRoute';

// Create a context to share user and cart state
export const AppContext = createContext();

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.withCredentials = true;

function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);

  const fetchUserAndCart = async () => {
    try {
      const userRes = await axios.get('/auth/status');
      if (userRes.data.user) {
        setUser(userRes.data.user);
        const cartRes = await axios.get('/api/cart');
        setCart(cartRes.data);
      } else {
        setUser(null);
        setCart({ items: [], total: 0 }); // Reset cart if not logged in
      }
    } catch (error) {
      console.error('Error fetching user/cart status:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAndCart();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  return (
    <AppContext.Provider value={{ user, setUser, cart, setCart, fetchUserAndCart }}>
      <div className="bg-gray-100 min-h-screen">
        <Toaster 
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            success: {
              duration: 2000,
              style: {
                background: 'green',
                color: 'white',
              },
            },
            error: {
              duration: 2000,
              style: {
                background: 'red',
                color: 'white',
              },
            },
            loading: {
              duration: 1000,
              style: {
                background: 'blue',
                color: 'white',
              },
            },
          }}
        />
        <Navbar />
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route 
              path="/cart" 
              element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
      </div>
    </AppContext.Provider>
  );
}

export default App;