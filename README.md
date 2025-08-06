# E-Commerce App

A full-stack e-commerce application built with React (frontend) and Express/Sequelize/SQLite (backend). Features include user authentication (local & Google OAuth), product browsing, shopping cart, and secure session management.

## Project Structure

- `client/` — React frontend (Vite, TailwindCSS)
- `server/` — Express backend (Sequelize ORM, SQLite DB)
- `.env.example` — Example environment variables

## Features

- User registration & login (email/password & Google OAuth)
- Product catalog
- Shopping cart (add, update, remove items)
- Persistent sessions
- Responsive UI

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Setup

1. **Clone the repo:**
   ```sh
   git clone https://github.com/amkaays/ecommerce-app.git
   cd ecommerce-app
   ```

2. **Install dependencies:**
   ```sh
   npm run install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill in your secrets.

## Environment Variables

You need to set up the following secrets in your `.env` file:

- `SESSION_SECRET`: Use any long, random string for session encryption.
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK`:  
  To enable Google OAuth login, create credentials in the [Google Cloud Console](https://console.cloud.google.com/):
  1. Go to **APIs & Services > Credentials**.
  2. Click **Create Credentials > OAuth client ID**.
  3. Choose **Web application** and set the authorized redirect URI to `http://localhost:3000/auth/google/callback`.
  4. Copy your **Client ID** and **Client Secret** into your `.env` file.

See [.env.example](.env.example) for the required variable

4. **Seed the database (optional, for demo data):**
   ```sh
   npm run seed --prefix server
   ```

5. **Start development servers:**
   ```sh
   npm run dev
   ```
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3000

## Usage

- Visit the frontend URL to browse products, register/login, and manage your cart.
- Google OAuth requires valid credentials in `.env`.

## Scripts

- `npm run dev` — Start both frontend and backend in development mode
- `npm run seed --prefix server` — Seed demo data into the database

## Environment Variables

See [.env.example](.env.example) for required variables.

## License

ISC

---

**Author:** Amjad Manzoor