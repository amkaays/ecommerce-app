// File: server/routes/auth.js
import express from 'express';
import passport from 'passport';
import User from '../models/User.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User registration and login
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: User already exists.
 */
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists.' });
    }
const newUser = await User.create({ email, password });

    req.login(newUser, (err) => {
      if (err) { return res.status(500).json({ message: 'Session error' }); }
      return res.status(201).json({_id: req.user._id, displayName: req.user.displayName, email: req.user.email });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in an existing user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized (incorrect email or password).
 */
// Login with email/password
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info.message });
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.status(200).json({_id: req.user._id, displayName: req.user.displayName, email: req.user.email });
    });
  })(req, res, next);
});

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: 'http://localhost:5173/login' }), (req, res) => {
  res.redirect('http://localhost:5173/'); // Redirect to frontend home
});

// Logout
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    req.session.destroy((err) => {
      res.clearCookie('connect.sid');
      res.status(200).json({ message: 'Logged out successfully' });
    });
  });
});

// Check auth status
router.get('/status', (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).json({ user: {_id: req.user._id, displayName: req.user.displayName, email: req.user.email } });
    } else {
        res.status(200).json({ user: null });
    }
});


export default router;