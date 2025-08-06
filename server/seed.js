// File: server/seed.js
import sequelize from './database.js';
import User from './models/User.js';
import Product from './models/Product.js';

const seedDB = async () => {
  // Sync all models with the database, dropping existing tables
  await sequelize.sync({ force: true });
  console.log('Database synced! Dropping old data and creating new tables.');

  console.log('Seeding new data...');

  // Seed Users
  await User.bulkCreate([
    { email: 'user1@example.com', password: 'password123' },
    { email: 'user2@example.com', password: 'password123' },
    { email: 'user3@example.com', password: 'password123' },
  ], { individualHooks: true }); // individualHooks ensures beforeCreate runs for each

  console.log('Users seeded.');

  // Seed Products
  await Product.bulkCreate([
    { 
        title: 'Classic White Tee', 
        description: 'A timeless staple. Made from 100% premium pima cotton for a soft, comfortable feel that lasts.', 
        price: 29.99, 
        image: '/images/t-shirt.jpg'  // Local path
    },
    { 
        title: 'Heather Grey Hoodie', 
        description: 'The perfect hoodie for cool evenings. Features a brushed fleece interior, and a modern, tailored fit.', 
        price: 65.00, 
        image: '/images/hoodie.jpg'  // Local path
    },
    { 
        title: 'All-Weather Bomber Jacket', 
        description: 'A versatile, lightweight bomber jacket. Water-resistant shell with a quilted lining for warmth.', 
        price: 125.00, 
        image: '/images/jacket.jpg' // Local path
    },
    { 
        title: 'Vintage Wash Denim', 
        description: 'Classic straight-leg jeans with a vintage wash. Crafted from durable, non-stretch denim for an authentic feel.', 
        price: 89.99, 
        image: '/images/jeans.jpg'  // Local path
    },
    { 
        title: 'Minimalist White Sneakers', 
        description: 'Clean, versatile, and comfortable. These leather sneakers are designed to complement any outfit.', 
        price: 110.00, 
        image: '/images/sneakers.jpg' // Local path
    },
    { 
        title: 'Everyday Canvas Tote', 
        description: 'A durable and spacious canvas tote bag, perfect for groceries, books, or a trip to the beach.', 
        price: 35.00, 
        image: '/images/tote-bag.jpg' // Local path
    },
]);

  console.log('Products seeded.');
  console.log('Seeding complete!');
};

seedDB().catch(err => {
  console.error('Failed to seed database:', err);
});