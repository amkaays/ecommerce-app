// File: server/routes/products.js
import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll(); // Changed from .find({})
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;