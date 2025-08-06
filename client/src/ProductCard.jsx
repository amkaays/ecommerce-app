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
      const res = await axios.post('/api/cart/add', { product, quantity: 1 });
      setCart(res.data);
      toast.success(`${product.title} added to cart!`);
    } catch (error) {
      toast.error('Failed to add to cart.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300">
      <img src={product.image} alt={product.title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{product.title}</h3>
        <p className="text-gray-600 mt-2 text-sm">{product.description}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-xl font-bold text-gray-800">${product.price.toFixed(2)}</span>
          <button
            onClick={handleAddToCart}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
export default ProductCard;