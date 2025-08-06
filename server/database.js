// File: server/database.js
import { Sequelize } from 'sequelize';

// This creates a new Sequelize instance and tells it to use SQLite
// It will create a file named 'dev.sqlite' in the 'server' directory
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './dev.sqlite', // Path to the database file
  logging: false, // Set to console.log to see SQL queries
});

export default sequelize;