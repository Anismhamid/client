# E-Commerce C2C Marketplace - Sell & Buy

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.0-purple?logo=vite)
![Socket.io](https://img.shields.io/badge/Socket.io-4.0-black?logo=socket.io)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

## Project Summary

This is a comprehensive C2C (Consumer-to-Consumer) e-commerce marketplace that allows users to **list, sell, and buy** a wide range of products (cars, electronics, real estate, and personal items). The system features direct messaging, featured ad management, and an intelligent SEO archiving system.

---

## 📑 Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Technologies](#technologies)
4. [Environment Variables](#environment-variables)
5. [Setup & Installation](#setup--installation)
6. [Components Overview](#components-overview)
7. [Services](#services)
8. [API Integration](#api-integration)
9. [SEO & Sitemap](#seo--sitemap)
10. [Routes](#routes)
11. [How to Contribute](#how-to-contribute)
12. [License](#license)

---

## 🌐 Project Overview

A C2C e-commerce platform that enables local suppliers and individuals to showcase their products in organized categories. The application supports direct communication between buyers and sellers via real-time chat, featured ad management, with a strong focus on user experience and search engine visibility.

---

## ✨ Features

- **Comprehensive Categories:** Includes cars, motorcycles, trucks, electronics, home, garden, clothing, and health products.
- **Advanced User Roles:** Sophisticated permission system (Admin, Moderator, Client).
- **Internal Messaging System:**
    - Real-time chat using **Socket.IO**
    - Reply to specific messages and important message alerts
    - Direct communication between buyer and seller without sharing personal contact information
- **Smart SEO:** Search engine friendly URLs, dynamic sitemap, and optimized help center pages for better visibility
- **Featured Ads Dashboard:** Dedicated dashboard for managing and activating featured advertisements
- **Responsive Design:** Modern UI compatible with all screen sizes using **MUI** and **Bootstrap 5**
- **User Profiles:** User profile pages (sellers/buyers) displaying ratings and listings

---

## Technologies

### Frontend

- **Framework:** React 19 + Vite
- **Language:** TypeScript
- **Routing:** React Router DOM v7
- **Real-time:** Socket.IO Client
- **Styling:** Material UI (MUI), Bootstrap 5, Font Awesome
- **Form Handling:** Formik & Yup

### Backend

- **Runtime:** Node.js & Express.js
- **Database:** MongoDB Atlas (Mongoose)
- **API Design:** Modular RESTful API routing

### Real-time Communication

- **Socket.IO** for live updates, notifications, and real-time messaging between users

### Security & Auth

- **Helmet** for securing HTTP headers
- **express-rate-limit** for request limiting
- **jsonwebtoken (JWT)** for authentication
- **bcryptjs** for password hashing
- **Google OAuth** integration for social login

### Validation & Logging

- **Joi** for request data validation
- Custom logging middleware with file persistence

### Development & Tooling

- TypeScript
- Vite
- ESLint
- CORS middleware
- Development tools: chalk, express-list-routes, cross-env

### Backend Repository

- [Visit GitHub for Server-side](https://github.com/Anismhamid/server)

---

## 🔐 Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file. An example file `.env.example` is provided in the repository.

```env
# The URL of your running backend API
VITE_API_URL=http://localhost:8209/api

# The URL for the Socket.IO server (usually the same as your backend)
VITE_SOCKET_URL=http://localhost:8209

# Your Google OAuth Client ID for social login
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

## Setup & Installation

### Prerequisites

- Node.js v20.18.x or higher — Download Node.js
- npm (comes with Node.js)

- Backend Server: This project requires the backend server to be running. You can find it at: https://github.com/Anismhamid/server. Follow its setup instructions to get it running locally.

- MongoDB (local or Atlas)

- Postman or Insomnia for API testing (optional)

## Installation

```bash
git clone https://github.com/Anismhamid/client.git

```

```bash
cd client
npm install
```

### Run the Application

## Development mode:

```bash
npm run dev
```

- Runs the client at: http://localhost:5173

- Backend server (if running locally) at: http://localhost:8209

## Production mode:

```bash
npm run build
npm run preview
```

- Runs the client at: http://localhost:4173

### Usage

- After starting the application, open your browser at the URL mentioned above

- Browse products by categories, communicate with sellers via direct messaging

- Use the dashboard (after login) to manage ads and products

### Components Overview

- Navbar: Dynamic navigation with category filters, search, login/logout, and user profile menu (no shopping cart - C2C model)

- ProductCard: Displays individual products with image, price, contact seller button, and favorite option

- UserProfile: Displays user information (seller/buyer), ratings, and listings

- MessagingPage: Direct messaging system with ability to reply to specific messages

- ChatWindow: Real-time chat window with another user

- Login/Register forms: User authentication and registration with validation

- AdminDashboard: Admin panel for managing users and featured ads

- FeaturedAdsDashboard: Dashboard for managing and activating featured advertisements

- HelpCenter: SEO-optimized help pages (selling, safety, disputes)

### Services

- AuthService: Handles login, registration, JWT storage, and Google OAuth login

- ProductService: Fetches products, categories, and manages CRUD operations

- UserService: Manages user profiles and ratings

- MessageService: Manages sending and retrieving messages, including filtering and real-time updates via Socket.IO

- FeaturedAdService: Manages featured advertisements and their activation

- CategoryService: Fetches categories and their data

### API Integration

All data exchange with the backend server is done via RESTful API endpoints secured with JWT tokens.

#### Socket.IO is used for real-time features:

- Messaging: Send and receive instant messages between users

- Notifications: Alerts for new messages and ad updates

### SEO & Sitemap

- SEO-Friendly URLs: Clean and descriptive URLs for all product and category pages

- Dynamic Sitemap: Automatically generated sitemap.xml file to help search engines index the site

- Help Center Pages: Optimized help pages (selling, safety, disputes) for better search engine visibility

- Meta Tags: Optimized titles and descriptions for each page

- Structured Data: JSON-LD for rich snippets

## Routes

### Main Pages

| Path            | Description            |
| --------------- | ---------------------- |
| `/`             | Homepage               |
| `/login`        | Login                  |
| `/register`     | Register new account   |
| `/profile`      | User profile           |
| `/adsDashboard` | Featured ads dashboard |

### Categories

| Path                          | Description       |
| ----------------------------- | ----------------- |
| `/category/cars`              | Cars              |
| `/category/motorcycles`       | Motorcycles       |
| `/category/bikes`             | Bicycles          |
| `/category/trucks`            | Trucks            |
| `/category/electric-vehicles` | Electric vehicles |
| `/category/house`             | House             |
| `/category/garden`            | Garden            |
| `/category/baby`              | Baby products     |
| `/category/electronics`       | Electronics       |
| `/category/kids`              | Kids products     |
| `/category/beauty`            | Beauty products   |
| `/category/cleaning`          | Cleaning supplies |
| `/category/health`            | Health products   |
| `/category/watches`           | Watches           |
| `/category/women-clothes`     | Women's clothing  |
| `/category/men-clothes`       | Men's clothing    |
| `/category/women-bags`        | Women's bags      |

### Help Center (SEO)

| Path             | Description         |
| ---------------- | ------------------- |
| `/help/selling`  | Selling guidelines  |
| `/help/safety`   | Safety instructions |
| `/help/disputes` | Dispute resolution  |

### User & Messaging

| Path                    | Description             |
| ----------------------- | ----------------------- |
| `/users/customer/:slug` | User profile page       |
| `/users-management`     | User management (admin) |
| `/admins`               | Admin management        |
| `/messages`             | Messages page           |
| `/messages/chat`        | Chat window             |

### Other Pages

| Path                    | Description          |
| ----------------------- | -------------------- |
| `/about`                | About us             |
| `/contact`              | Contact us           |
| `/blog`                 | Blog                 |
| `/brands/:brand`        | Brand page           |
| `/categories`           | All categories       |
| `/discounts-and-offers` | Discounts and offers |
| `/favorites`            | Favorites            |
| `/privacy-and-policy`   | Privacy policy       |
| `/term-of-use`          | Terms of use         |

### How to Contribute

1.  Fork the repository

2.  Create your feature branch

```bash
git checkout -b feature/amazing-feature
```

3. Create your feature branch

```bash
git commit -m 'Add some amazing feature'
```

4. Push to the branch

```bash
git push origin feature/amazing-feature
```

5. Open a pull request

### License

This project is licensed under the MIT License.

Made with ❤️ for the C2C community

A complete marketplace platform for peer-to-peer buying and selling
