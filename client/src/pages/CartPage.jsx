// File: client/src/pages/CartPage.jsx
import React, { useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AppContext } from '../App';
import { TrashIcon } from '@heroicons/react/24/outline';

function CartPage() {
  const { cart, setCart } = useContext(AppContext);

  const handleUpdateQuantity = async (productId, quantity) => {
    // Basic validation to prevent sending invalid quantities
    if (isNaN(quantity) || quantity < 1) {
      quantity = 1;
    }
    
    try {
      const res = await axios.put(`/api/cart/update/${productId}`, { quantity });
      setCart(res.data);
      toast.success('Cart updated!');
    } catch (error) {
      toast.error('Failed to update cart.');
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const res = await axios.delete(`/api/cart/remove/${productId}`);
      setCart(res.data);
      toast.success('Item removed from cart!');
    } catch (error) {
      toast.error('Failed to remove item.');
    }
  };

  if (!cart || cart.items.length === 0) {
    return <div className="text-center text-2xl mt-10">Your cart is empty.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>
      <div className="space-y-4">
        {cart.items.map(item => (
          <div key={item.product.id} className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center">
              <img src={item.product.image} alt={item.product.title} className="w-20 h-20 object-cover rounded-lg mr-4" />
              <div>
                <h2 className="font-semibold">{item.product.title}</h2>
                <p className="text-gray-600">${item.product.price.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <input 
                type="number" 
                value={item.quantity}
                min="1"
                onChange={(e) => handleUpdateQuantity(item.product.id, parseInt(e.target.value))}
                className="w-16 text-center border rounded"
              />
              <button onClick={() => handleRemoveItem(item.product.id)} className="text-red-500 hover:text-red-700">
                <TrashIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 text-right">
        <h2 className="text-2xl font-bold">Total: ${cart.total.toFixed(2)}</h2>
        <button className="mt-4 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
export default CartPage;