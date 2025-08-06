// File: client/src/components/ProductCard.jsx
import React, { useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AppContext } from '../App';
import { useNavigate } from 'react-router-dom';

function ProductCard({ product }) {
  const { user, setCart } = useContext(AppContext);
  const navigate = useNavigate();

 const handleAddToCart = async () => {
  if (!user) {
    toast.error('Please log in to add items to the cart.');
    navigate('/login');
    return;
  }
  try {
    // Only send the product's ID
    const res = await axios.post('/api/cart/add', { productId: product.id, quantity: 1 });
    setCart(res.data);
    toast.success(`${product.title} added to cart!`);
  } catch (error) {
    console.error('Add to cart error:', error.response?.data || error.message);
    toast.error(error.response?.data?.message || 'Failed to add to cart.');
  }
};

  if (!product || typeof product.price !== 'number') {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col group">
      {/* Container for the image */}
      <div className="relative overflow-hidden">
        <img 
          src={product.image} 
          alt={product.title} 
          // Using object-cover for a clean, uniform grid.
          // The new image URLs are landscape, so this will look great.
          className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105" 
        />
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-900">{product.title}</h3>
        <p className="text-gray-600 mt-2 text-sm flex-grow">{product.description}</p>
        
        <div className="flex justify-between items-center mt-4">
          <span className="text-xl font-bold text-gray-800">
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;