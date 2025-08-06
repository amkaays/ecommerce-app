// File: server/routes/cart.js
import express from 'express';
import Product from '../models/Product.js'; // Make sure Product model is imported

const router = express.Router();

// Middleware to initialize cart in session
const initializeCart = (req, res, next) => {
  if (!req.session.cart) {
    req.session.cart = { items: [], total: 0 };
  }
  next();
};

router.use(initializeCart);

// Get cart
router.get('/', (req, res) => {
  res.status(200).json(req.session.cart);
});

// Add item to cart
router.post('/add', async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cart = req.session.cart;

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    const productData = product.get({ plain: true });
    const existingItemIndex = cart.items.findIndex(item => item.product.id === productId);

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productData, quantity: quantity });
    }
    
    cart.total = cart.items.reduce((acc, item) => {
      return acc + (item.product.price * item.quantity);
    }, 0);
    
    req.session.save((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to save session." });
      }
      res.status(200).json(cart);
    });

  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Server error while adding to cart." });
  }
});

// Update item quantity
router.put('/update/:productId', (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  const cart = req.session.cart;

  const itemIndex = cart.items.findIndex(item => String(item.product.id) === productId);

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity = quantity;
    if (cart.items[itemIndex].quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    }
  }

  cart.total = cart.items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  req.session.save(() => {
    res.status(200).json(cart);
  });
});

// Remove item from cart
router.delete('/remove/:productId', (req, res) => {
  const { productId } = req.params;
  const cart = req.session.cart;
  
  const itemIndex = cart.items.findIndex(item => String(item.product.id) === productId);

  if (itemIndex > -1) {
    cart.items.splice(itemIndex, 1);
  }

  cart.total = cart.items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  req.session.save(() => {
    res.status(200).json(cart);
  });
});

export default router;