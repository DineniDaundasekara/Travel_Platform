# 🌍 Wanderlust — Travel Experience Listing Platform

> A full-stack web platform where travel experience providers can publish listings and travelers can discover unique local experiences worldwide.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://travel-platform-lake.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render)](https://wanderlust-travel-2zrj.onrender.com/api/health)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/DineniDaundasekara/Travel_Platform.git)

---

## 📌 Project Overview

**Wanderlust** is a simplified marketplace-style web application built for the Lynkerr Full-Stack Technical Challenge. It solves a real problem: small travel businesses — tour guides, activity hosts, and local experience operators — often have no online presence, and travelers struggle to discover unique local experiences.

The platform allows:
- **Experience providers** to register, log in, and publish travel experience listings
- **Travelers** to browse a public feed, search by keyword, filter by category, like and save listings, and view full details

---

## 🛠 Tech Stack

| Layer | Technology | Reason |
|-------|-----------|--------|
| Frontend | **Next.js 14** (App Router) | File-based routing, SSR, seamless Vercel deployment |
| Styling | **Tailwind CSS** | Utility-first, rapid responsive UI development |
| Backend | **Node.js + Express.js** | Lightweight, flexible RESTful API |
| Database | **MongoDB Atlas + Mongoose** | Flexible document model, schema validation, free tier |
| Authentication | **JWT + bcryptjs** | Stateless token auth, secure password hashing |
| Frontend Deploy | **Vercel** | Auto CI/CD from GitHub, optimized for Next.js |
| Backend Deploy | **Render** | Free Node.js hosting with auto-deploy |

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js >= 18
- MongoDB Atlas account ([free tier](https://mongodb.com/atlas))
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/DineniDaundasekara/Travel_Platform.git
cd Travel_Platform
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
```

Fill in your `.env` file:
```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/travel-platform?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key_minimum_32_characters
PORT=5000
CLIENT_URL=http://localhost:3000
```

```bash
npm run dev          # Runs on http://localhost:5000
node seed.js         # Optional: adds 6 sample listings + demo user
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
cp .env.local.example .env.local
```

Fill in your `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

```bash
npm run dev          # Runs on http://localhost:3000
```

### 4. Demo Credentials (after running seed.js)
```
Email:    demo@wanderlust.com
Password: password123
```

---

## ✅ Features Implemented

### Core Features (All Required)
- [x] **User Registration** — Name, email, password with validation
- [x] **User Login / Logout** — JWT-based auth, redirects to feed after login
- [x] **Create Listing** — Title, location, image URL, description, price (optional)
- [x] **Public Feed** — All listings newest-to-oldest with image, title, location, description, creator name & time posted
- [x] **Listing Detail Page** — Full details including image, title, location, description, price, creator name

### Optional Features (All Implemented)
- [x] **Edit Listing** — Owner-only edit form pre-filled with existing data
- [x] **Delete Listing** — Owner-only delete with confirmation prompt
- [x] **Search Listings** — Full-text search across title, description, and location
- [x] **Category Filter** — 7 categories: Adventure, Culture, Food & Drink, Nature, Wellness, Water Sports, Other
- [x] **Like Listing** — Toggle like with live count
- [x] **Save Listing** — Bookmark listings to a personal saved list
- [x] **Responsive Mobile UI** — Fully responsive with hamburger menu and stacked layout
- [x] **Pagination (Load More)** — 12 listings per page with load more button
- [x] **User Profile Page** — Edit name, bio, avatar — view all personal listings

---

## 🏗 Architecture & Key Decisions

### Why This Technology Stack

**Next.js 14** with the App Router was chosen for its file-based routing, built-in image optimization, automatic code splitting, and seamless Vercel deployment. **Express.js** provides a lightweight, unopinionated API layer without unnecessary overhead — ideal for a focused REST API. **MongoDB** with Mongoose suits travel listings well: listings are self-contained documents that can evolve independently, and Mongoose adds schema validation with middleware hooks (e.g., automatic password hashing on save). **Tailwind CSS** enabled rapid UI development with a consistent design system.

### How Authentication Works

The application uses **stateless JWT (JSON Web Token)** authentication:

1. User submits credentials → backend validates against the database
2. On success, server signs a JWT with `JWT_SECRET` (7-day expiry) and returns it
3. Client stores the token in `localStorage`
4. All subsequent API requests include `Authorization: Bearer <token>` header
5. Backend `protect` middleware verifies the token on every protected route using `jsonwebtoken`
6. Passwords are hashed with **bcryptjs** (12 salt rounds) before storage — plaintext passwords never touch the database

### How Travel Listings Are Stored

Each listing is a **MongoDB document** in the `listings` collection:

```
Listing {
  title, location, description   → String (required, with min/max length)
  imageUrl                       → String (required)
  price, currency                → Number + String (optional)
  category                       → String enum (7 options)
  creator                        → ObjectId ref → User (populated on queries)
  likes[]                        → Array of User ObjectIds (toggle = add/remove)
  saved[]                        → Array of User ObjectIds (bookmark feature)
  createdAt, updatedAt           → Auto-managed by Mongoose timestamps
}
```

**Indexes used:**
- Text index on `title + description + location` → enables `$text` full-text search
- `{ createdAt: -1 }` → efficient newest-first feed sorting
- `{ creator: 1 }` → fast user profile listing queries

### One Improvement With More Time

I would implement **direct image upload via Cloudinary** instead of requiring image URLs. Currently users must find and paste external URLs, which is a friction point during listing creation. With Cloudinary's upload widget, users could drag-and-drop photos directly from their device. The backend already includes `cloudinary` and `multer` as dependencies — a `/api/upload` endpoint would accept multipart data, upload to Cloudinary, and return an optimized URL. Cloudinary also provides automatic resizing and CDN delivery, which would significantly improve feed performance.

---

## 📈 Product Thinking — Scaling to 10,000 Listings

With 10,000 listings, the first change I would make is switching from **offset-based to cursor-based pagination** using the listing's `_id` as a cursor. MongoDB's `skip()` operation slows significantly at large offsets since it scans and discards skipped documents — cursor-based pagination avoids this entirely, keeping performance constant regardless of dataset size.

For **search and filtering**, I would evaluate **MongoDB Atlas Search** (powered by Lucene) to replace the basic `$text` index. Atlas Search supports relevance scoring, fuzzy matching for typos, autocomplete, and faceted filtering. I would also add compound indexes on `{ category: 1, createdAt: -1 }` and `{ location: 1, createdAt: -1 }` to speed up the most common filtered feed queries.

On the **caching layer**, I would implement **Redis** to cache the public feed with a short TTL (30–60 seconds). Since most visitors read the same data, this dramatically reduces database load. Cache invalidation would trigger on listing create, update, or delete. For popular listing detail pages, **Next.js ISR** (Incremental Static Regeneration) could pre-render them and revalidate on a schedule.

**API payload optimization** would also matter at scale — adding field projection to the feed endpoint to only return fields needed by the card component (excluding full description, raw likes array) would reduce response payload size by ~60%. Finally, migrating to **Cloudinary CDN** for images rather than relying on external URLs would ensure consistent loading speeds and enable on-the-fly resizing for thumbnails vs. full-size views.

---

## 📁 Project Structure

```
wanderlust-travel/
├── backend/
│   ├── models/
│   │   ├── User.js              # Schema: name, email, hashed password, avatar, bio
│   │   └── Listing.js           # Schema: all fields, indexes, likes/saves arrays
│   ├── routes/
│   │   ├── auth.js              # POST /register, POST /login, GET /me
│   │   ├── listings.js          # Full CRUD + like/save toggle endpoints
│   │   └── users.js             # GET /:id/listings, PUT /profile
│   ├── middleware/
│   │   └── auth.js              # JWT verification middleware
│   ├── server.js                # Express app entry point
│   ├── seed.js                  # Demo data seeder
│   └── .env.example
└── frontend/
    ├── app/
    │   ├── page.js              # Feed homepage (search, filter, load more)
    │   ├── layout.js            # Root layout with Navbar + AuthProvider
    │   ├── auth/
    │   │   ├── login/page.js
    │   │   └── register/page.js
    │   ├── create/page.js       # Create listing (protected)
    │   ├── listings/[id]/
    │   │   ├── page.js          # Listing detail page
    │   │   └── edit/page.js     # Edit listing (owner only)
    │   └── profile/page.js      # User profile + listings
    ├── components/
    │   ├── Navbar.js            # Responsive nav with auth state
    │   ├── ListingCard.js       # Feed card with like/save
    │   ├── ListingForm.js       # Reusable create/edit form
    │   └── SearchBar.js         # Search input + category pills
    ├── lib/
    │   ├── AuthContext.js       # Global auth state (React Context)
    │   ├── api.js               # Axios instance + all API calls
    │   └── utils.js             # timeAgo, formatPrice, helpers
    └── .env.local.example
```

---

## 🌐 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Register new user, returns JWT |
| POST | `/api/auth/login` | Public | Login, returns JWT + user object |
| GET | `/api/auth/me` | Protected | Get current authenticated user |
| GET | `/api/listings` | Public | Get all listings (search, category, page) |
| GET | `/api/listings/:id` | Public | Get single listing with creator details |
| POST | `/api/listings` | Protected | Create new listing |
| PUT | `/api/listings/:id` | Protected | Update listing (owner only) |
| DELETE | `/api/listings/:id` | Protected | Delete listing (owner only) |
| POST | `/api/listings/:id/like` | Protected | Toggle like on listing |
| POST | `/api/listings/:id/save` | Protected | Toggle save on listing |
| GET | `/api/users/:id/listings` | Public | Get all listings by a user |
| PUT | `/api/users/profile` | Protected | Update authenticated user's profile |

---

## 🚀 Deployment

### Frontend → Vercel
1. Import GitHub repo at [vercel.com](https://vercel.com)
2. Set **Root Directory** to `frontend`
3. Add environment variable: `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api`
4. Deploy — auto-redeploys on every push to `main`

### Backend → Render
1. Create **Web Service** at [render.com](https://render.com)
2. Set **Root Directory** to `backend`
3. Build: `npm install` | Start: `node server.js`
4. Add environment variables: `MONGO_URI`, `JWT_SECRET`, `PORT=10000`, `CLIENT_URL`
5. Deploy — auto-redeploys on every push to `main`

> **Note:** Render free services sleep after 15 min of inactivity. First request after sleep takes ~30 seconds to wake up.

---

*Built for the Lynkerr Full-Stack Software Engineer Intern Technical Challenge.*
