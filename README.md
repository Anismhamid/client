# صفقة | E-Commerce C2C Marketplace

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.0-purple?logo=vite)
![Socket.io](https://img.shields.io/badge/Socket.io-4.0-black?logo=socket.io)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

A C2C (Consumer-to-Consumer) marketplace that lets users list, sell, and buy products across categories like cars, electronics, real estate, and personal items — with real-time messaging, featured ads, and strong SEO.

**Live:** [client-qqq1.vercel.app](https://client-qqq1.vercel.app) · **Backend:** [github.com/Anismhamid/server](https://github.com/Anismhamid/server)

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Getting Started](#getting-started)
4. [Environment Variables](#environment-variables)
5. [Project Structure](#project-structure)
6. [Routes](#routes)
7. [SEO](#seo)
8. [Contributing](#contributing)
9. [License](#license)

---

## Features

- **Product categories** — cars, motorcycles, trucks, electronics, home, garden, clothing, health, and more
- **Role-based access** — Admin, Moderator, and Client permission levels
- **Real-time messaging** — Socket.IO chat between buyers and sellers, with reply-to and message alerts, no personal contact info required
- **Featured ads dashboard** — manage and activate promoted listings
- **SEO-optimized** — clean URLs, dynamic sitemap, JSON-LD structured data, optimized meta tags
- **Responsive UI** — MUI + Bootstrap 5, works on all screen sizes
- **User profiles** — seller/buyer pages with ratings and listings
- **Google OAuth** — social login support

---

## Tech Stack

### Frontend
| | |
|---|---|
| Framework | React 19 + Vite |
| Language | TypeScript 5 |
| Routing | React Router DOM v7 |
| Styling | Material UI (MUI), Bootstrap 5, Font Awesome |
| Real-time | Socket.IO Client |
| Forms | Formik + Yup |

### Backend
| | |
|---|---|
| Runtime | Node.js + Express.js |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT + bcryptjs + Google OAuth |
| Security | Helmet, express-rate-limit |
| Validation | Joi |

---

## Getting Started

### Prerequisites

- Node.js v20.18 or higher
- The [backend server](https://github.com/Anismhamid/server) running locally or deployed
- MongoDB (local or Atlas)

### Installation

```bash
git clone https://github.com/Anismhamid/client.git
cd client
npm install
```

### Development

```bash
npm run dev
# Client runs at http://localhost:5173
# Backend expected at http://localhost:8209
```

### Production

```bash
npm run build
npm run preview
# Preview runs at http://localhost:4173
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```env
# Backend API base URL
VITE_API_URL=http://localhost:8209/api

# Socket.IO server URL (usually same as API)
VITE_SOCKET_URL=http://localhost:8209

# Google OAuth client ID
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

---

## Project Structure

### Key Components

| Component | Description |
|---|---|
| `Navbar` | Category filters, search, auth menu |
| `ProductCard` | Product image, price, contact seller, favorites |
| `UserProfile` | Seller/buyer info, ratings, listings |
| `MessagingPage` | Full messaging interface with reply support |
| `ChatWindow` | Real-time Socket.IO chat window |
| `AdminDashboard` | User and ad management for admins |
| `FeaturedAdsDashboard` | Manage featured/promoted listings |
| `HelpCenter` | SEO-optimized help pages |

### Key Services

| Service | Responsibility |
|---|---|
| `AuthService` | Login, register, JWT, Google OAuth |
| `ProductService` | Product CRUD, categories |
| `UserService` | Profiles, ratings |
| `MessageService` | Send/receive messages, Socket.IO |
| `FeaturedAdService` | Featured ad activation |

---

## Routes

### Main Pages

| Path | Description |
|---|---|
| `/` | Homepage |
| `/login` | Login |
| `/register` | Register |
| `/profile` | User profile |
| `/adsDashboard` | Featured ads dashboard |
| `/about` | About |
| `/contact` | Contact |
| `/blog` | Blog |
| `/favorites` | Favorites |
| `/privacy-and-policy` | Privacy policy |
| `/term-of-use` | Terms of use |
| `/discounts-and-offers` | Discounts and offers |

### Categories

| Path | Description |
|---|---|
| `/category/cars` | Cars |
| `/category/motorcycles` | Motorcycles |
| `/category/bikes` | Bicycles |
| `/category/trucks` | Trucks |
| `/category/electric-vehicles` | Electric vehicles |
| `/category/house` | House |
| `/category/garden` | Garden |
| `/category/baby` | Baby products |
| `/category/electronics` | Electronics |
| `/category/kids` | Kids products |
| `/category/beauty` | Beauty |
| `/category/cleaning` | Cleaning |
| `/category/health` | Health |
| `/category/watches` | Watches |
| `/category/women-clothes` | Women's clothing |
| `/category/men-clothes` | Men's clothing |
| `/category/women-bags` | Women's bags |

### Help Center

| Path | Description |
|---|---|
| `/help/selling` | Selling guidelines |
| `/help/safety` | Safety instructions |
| `/help/disputes` | Dispute resolution |

### Users & Messaging

| Path | Description |
|---|---|
| `/users/customer/:slug` | Public user profile |
| `/users-management` | User management (admin) |
| `/admins` | Admin management |
| `/messages` | Messages list |
| `/messages/chat` | Chat window |
| `/brands/:brand` | Brand page |
| `/categories` | All categories |

---

## SEO

- Clean, descriptive URLs for all product and category pages
- Dynamic `sitemap.xml` for search engine indexing
- JSON-LD structured data for rich snippets
- Optimized `<title>` and `<meta name="description">` per page via React 19 native head tag hoisting
- Help center pages targeting long-tail search queries

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request

---

## License

MIT License — see [LICENSE](./LICENSE) for details.

---

Made with ❤️ for the C2C community