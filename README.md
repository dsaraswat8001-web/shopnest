# ShopNest — E-Commerce Web App (Task 3)

Full-stack e-commerce application built with React + Node.js/Express + MongoDB Atlas.

## 🚀 Features
- 🛍️ Product catalog with search, category filters, sorting, pagination
- 🔐 JWT authentication with role-based access (Admin / User)
- 🛒 Persistent shopping cart (localStorage)
- 📦 Full checkout flow with order management
- ⭐ Product reviews and ratings
- 👑 Admin dashboard: product CRUD, order status management, stats
- 📱 Fully responsive dark UI

## 🏗️ Tech Stack
| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express |
| Database | MongoDB Atlas |
| Auth | JWT (7-day expiry) |
| Deploy FE | Vercel |
| Deploy BE | Render |

## 📁 Project Structure
```
ecommerce/
├── server/          # Express API
│   ├── models/      # User, Product, Order
│   ├── routes/      # auth, products, orders
│   ├── middleware/  # JWT auth + admin guard
│   └── seed/        # Demo data seeder
└── client/          # React + Vite
    └── src/
        ├── context/ # Auth, Cart, Toast
        ├── pages/   # Home, Cart, Checkout, Orders, Admin
        └── components/
```

## 🔧 Local Setup

### 1. Clone & install
```bash
# Server
cd server
npm install
cp .env.example .env   # fill in MONGODB_URI + JWT_SECRET

# Client
cd ../client
npm install
cp .env.example .env   # set VITE_API_URL=http://localhost:5000
```

### 2. Seed demo data
```bash
cd server
npm run seed
```
Creates:
- Admin: `admin@store.com` / `admin123`
- User: `user@store.com` / `user123`
- 12 demo products

### 3. Run locally
```bash
# Terminal 1 — server
cd server && npm run dev

# Terminal 2 — client
cd client && npm run dev
```
Visit: http://localhost:5173

---

## 🌐 Deployment Guide

### Step 1 — MongoDB Atlas
1. Create free cluster at https://cloud.mongodb.com
2. Add DB user, whitelist IP `0.0.0.0/0`
3. Copy connection URI

### Step 2 — GitHub
```bash
git init
git add .
git commit -m "Task 3: E-Commerce App"
git remote add origin https://github.com/YOUR_USERNAME/shopnest.git
git push -u origin main
```

### Step 3 — Render (Backend)
1. New Web Service → connect GitHub repo
2. Root Directory: `server`
3. Build Command: `npm install`
4. Start Command: `node server.js`
5. Environment Variables:
   - `MONGODB_URI` = your Atlas URI
   - `JWT_SECRET` = any long random string
   - `CLIENT_URL` = your Vercel URL (add after Step 4)

### Step 4 — Vercel (Frontend)
1. Import GitHub repo at https://vercel.com
2. Root Directory: `client`
3. Framework: Vite
4. Environment Variable:
   - `VITE_API_URL` = your Render URL (e.g. https://shopnest-api.onrender.com)

### Step 5 — Seed production data
```bash
cd server
MONGODB_URI="your-atlas-uri" node seed/seed.js
```

### Step 6 — Submit
Submit your **Vercel URL** as Task 3 submission. ✅

---

## 🔑 Demo Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@store.com | admin123 |
| User | user@store.com | user123 |

## 📋 API Endpoints
| Method | Path | Access |
|--------|------|--------|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/auth/me | Auth |
| GET | /api/products | Public |
| POST | /api/products | Admin |
| PUT | /api/products/:id | Admin |
| DELETE | /api/products/:id | Admin |
| POST | /api/products/:id/reviews | Auth |
| POST | /api/orders | Auth |
| GET | /api/orders/my | Auth |
| GET | /api/orders | Admin |
| PUT | /api/orders/:id/status | Admin |
| GET | /api/orders/admin/stats | Admin |
