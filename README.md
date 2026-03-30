# Raz Technologies

> Kenya's trusted platform for solar installations, CCTV systems, WiFi setup, electrical works, electric fencing, intercom systems, plumbing services, and electronic repairs — all under one roof.

**Live Site:** https://raztechnologies.co.ke

---

## What It Does

Raz Technologies is a full-stack web platform that serves two main purposes:

1. **Marketing & Lead Generation** — A professional landing page showcasing services, completed projects, customer reviews, and promotional videos to attract residential and commercial clients across Kenya.

2. **E-commerce & Bookings** — Customers can browse and purchase electronic products (inverters, cameras, panels, networking gear) and book installation or repair services — with M-Pesa payments handled directly on the platform.

---

## Features

### Customer-Facing
- Landing page with an animated hero image slider, services showcase, featured products, project portfolio, video adverts, and customer reviews
- Product catalogue with cart, direct order, and "call to order" option for users who prefer phone
- Service booking system with preferred date and location input
- M-Pesa STK Push payment integration via Safaricom Daraja API — customers pay directly from their phones
- User accounts with order history, service booking history, and profile management
- Password reset flow with a 6-digit email verification code
- Transactional emails for welcome, order confirmation, password reset, and contact form acknowledgement

### Admin Dashboard
- Full resource management for: Users, Products, Services, Categories, Orders, Payments, Reviews, Adverts, Service Requests, Jobs, Job Applications, and the Hero Slider
- Real-time data updates via WebSocket — dashboard reflects changes instantly without page refresh
- Cloudinary integration for image and video uploads across products, services, categories, and adverts
- Hero slider manager — control which slides appear on the landing page, their content, order, and visibility
- Order status pipeline management
- Job application tracking with a Pending → Reviewing → Interview → Accepted/Rejected pipeline

### Technical
- JWT authentication stored in **httpOnly signed cookies** — tokens are never exposed to client-side JavaScript
- Automatic access token refresh via an Axios response interceptor — sessions stay alive transparently
- Role-based route guards: `AdminGuard`, `CustomerGuard`, `GuestGuard`
- Soft delete across all models — records are never permanently removed, just hidden
- Scroll-aware active navigation with `IntersectionObserver`
- Fully responsive across mobile, tablet, and desktop

---

## Tech Stack

### Backend
| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | JWT (httpOnly signed cookies) |
| Real-time | Socket.IO |
| Email | Nodemailer + EJS templates |
| Payments | Safaricom Daraja API (STK Push) |
| Media Uploads | Cloudinary |
| Validation | Joi |
| Logging | Winston / custom Logger |

### Frontend
| Layer | Technology |
|---|---|
| Framework | React (Create React App) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Routing | React Router v6 |
| Data Fetching | TanStack Query (React Query) |
| HTTP Client | Axios (with interceptor for token refresh) |
| Forms | React Hook Form |
| Icons | Lucide React |
| Font | Alegreya Sans (Google Fonts) |
| Media Uploads | Cloudinary Upload API |

---

## Project Structure

```
raz-technologies/
│
├── backend/
│   └── src/
│       ├── controllers/       # Express route handlers
│       ├── services/          # Business logic layer
│       ├── middleware/         # Auth, error handling, validation
│       ├── routes/            # Express router definitions
│       ├── prisma/            # Prisma schema and migrations
│       ├── templates/
│       │   └── email/         # EJS email templates
│       │       ├── verify.mail.ejs
│       │       ├── welcome.mail.ejs
│       │       ├── order_confirmation.mail.ejs
│       │       └── contact_form.ejs
│       ├── shared/            # Shared types, enums, helpers
│       └── index.ts           # Express app entry point
│
└── frontend/
    └── src/
        ├── components/        # Shared UI components (Navbar, Footer, Toast, etc.)
        ├── context/           # AuthContext, Guards, Axios instance
        ├── hooks/             # Custom hooks (useScrollReveal, useSocketInvalidation, etc.)
        ├── pages/
        │   ├── admin/         # Admin dashboard pages
        │   │   └── components/# AdminUI primitives
        │   └── customer/      # Customer dashboard pages
        ├── services/          # API service functions
        ├── types/             # TypeScript interfaces and enums
        ├── index.css          # Tailwind base + global styles
        └── App.tsx            # Route configuration
```

---

## Getting Started

### Prerequisites

- Node.js v18 or later
- PostgreSQL database (local or hosted — e.g. Supabase, Neon, Railway)
- Safaricom Daraja API credentials (Consumer Key, Consumer Secret, Passkey)
- Cloudinary account (Cloud Name + unsigned upload preset)
- SMTP credentials for sending email (e.g. Gmail App Password, Resend, SendGrid)

---

### 1. Clone the repository

```bash
git clone url.git
cd raztech
```

---

### 2. Set up the Backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

Run Prisma migrations and start the backend:

```bash
npx prisma migrate dev
npx prisma generate
npm start
```

The backend runs on **http://localhost:3000** by default.

---

### 3. Set up the Frontend

```bash
cd ../frontend
npm install
```

Create a `.env` file in `frontend/`:

```env
REACT_APP_API_URL=http://localhost:3000
REACT_APP_SOCKET_URL=http://localhost:3001
```

Start the frontend:

```bash
npm start
```

The frontend runs on **http://localhost:3000** by default.

---

## M-Pesa Payment Flow

Payments use the **Safaricom Daraja STK Push API** (Lipa Na M-Pesa Online):

1. Customer clicks "Pay" and enters their Safaricom phone number
2. The backend requests an OAuth token from Daraja, then sends an STK Push request
3. The customer receives a payment prompt on their phone and enters their M-Pesa PIN
4. Daraja sends a callback to `MPESA_CALLBACK_URL` with the transaction result
5. The backend updates the `Payment` and `Order` records, and the frontend reflects the change in real time via WebSocket

> **Note:** For local development, use [ngrok](https://ngrok.com) or a similar tunnelling tool to expose your local callback URL to Safaricom's servers.

---

## Real-Time Updates

The platform uses **Socket.IO** to push live data changes from the backend to all connected clients. On the frontend, `useSocketInvalidation(ModelType.Product, ModelType.Order, ...)` subscribes to model-specific events and automatically invalidates the relevant TanStack Query cache — so the UI refreshes without a page reload whenever an admin makes a change.

---

## Authentication

- Login issues **two JWTs**: a short-lived access token (15 min) and a longer-lived refresh token (7 days), both stored as **httpOnly signed cookies**
- The Axios interceptor automatically calls `POST /auth/refresh` when a 401 is received, rotates both cookies, and retries the original request — completely invisible to the user
- Route guards on the frontend (`AdminGuard`, `CustomerGuard`, `GuestGuard`) read the user's role from a `GET /auth/me` call on app mount and redirect appropriately

---

## Email Templates

All transactional emails are rendered with **EJS** and sent via **Nodemailer**:

| Template | Trigger | Recipients |
|---|---|---|
| `welcome.mail.ejs` | New user registration | New user |
| `verify.mail.ejs` | Password reset request | Requesting user |
| `order_confirmation.mail.ejs` | Order placed | Ordering customer |
| `contact_form.ejs` | Contact form submitted | Admin inbox |

---

## Environment Notes

| Setting | Development | Production |
|---|---|---|
| Cookie `secure` flag | `false` | `true` |
| Cookie `sameSite` | `strict` | `strict` |
| MPESA_CALLBACK_URL | ngrok tunnel | Live domain |
| CORS origin | `http://localhost:3000` | Live frontend URL |

---

## License

This project is proprietary software. All rights reserved © Raz Technologies.

---

## Contact

**Exhecar Ent**
Eldoret, Kenya — Serving All Counties

📞 +254 768030478
