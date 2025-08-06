// File: server/app.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import session from 'express-session';
import passport from 'passport';
import SequelizeStore from 'connect-session-sequelize';

import sequelize from './database.js';
import passportConfig from './config/passport.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import cartRoutes from './routes/cart.js';

import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';

// Load Env Vars from the root .env file
dotenv.config({ path: '../.env' });

// Passport Config
passportConfig(passport);

const app = express();

// Initialize session store
const sessionStore = SequelizeStore(session.Store);
const store = new sessionStore({ db: sequelize });

// DB Connect and sync
sequelize.sync()
  .then(() => console.log('Database connected and synced...'))
  .catch(err => console.error('Error connecting to database:', err));

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session Middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: store, // Use the new sequelize store
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// Sync the session store table
store.sync();

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

// Swagger API Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});