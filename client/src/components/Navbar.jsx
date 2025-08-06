// File: client/src/components/Navbar.jsx
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../App';
import toast from 'react-hot-toast';
import { ShoppingCartIcon, UserCircleIcon, ArrowRightOnRectangleIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

function Navbar() {
  const { user, setUser, cart } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get('/auth/logout');
      setUser(null);
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const cartItemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-gray-800">
            <ShoppingBagIcon className="h-8 w-8 text-blue-500" />
            <span>E-Commerce</span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative text-gray-600 hover:text-gray-800">
              <ShoppingCartIcon className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            {user ? (
              <>
                <span className="text-gray-700 flex items-center">
                  <UserCircleIcon className="h-6 w-6 mr-1" />
                  {user.displayName || user.email}
                </span>
                <button onClick={handleLogout} className="text-gray-600 hover:text-gray-800 flex items-center">
                  <ArrowRightOnRectangleIcon className="h-6 w-6 mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="text-gray-600 hover:text-gray-800">Login</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;