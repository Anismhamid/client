# Safqa Marketplace | C2C Marketplace Frontend

A modern consumer-to-consumer marketplace frontend built with React, TypeScript, and Vite, designed to enable users to buy and sell products securely and effortlessly across multiple categories. The platform supports user authentication, real-time chat, ad management, product discovery, and role-based administration in a responsive, mobile-friendly experience.

![React](https://img.shields.io/badge/React-19-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6-646cff?logo=vite)
![Socket.io](https://img.shields.io/badge/Socket.io-4-010101?logo=socket.io)
![License](https://img.shields.io/badge/License-MIT-green)

This client app connects to a backend API and event server to provide a complete marketplace experience for users, sellers, and administrators.

Backend repository: [github.com/Anismhamid/server](https://github.com/Anismhamid/server)

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Main Routes](#main-routes)
- [Security & Stability Considerations](#security--stability-considerations)
- [Contributing](#contributing)
- [License](#license)

## Overview

Safqa Marketplace is a feature-rich frontend for a C2C trading platform that helps people discover, list, and negotiate the sale of products in a trusted and streamlined way. It supports a wide variety of listings including:

- Vehicles
- Electronics
- Home and garden items
- Fashion and accessories
- Health and beauty products
- Everyday essentials and miscellaneous goods

The frontend includes multiple user journeys, from browsing and filtering listings to messaging sellers, managing favorites, creating ads, and viewing profile pages. It is structured for both consumer usage and admin oversight.

## Key Features

- Responsive marketplace UI built with React and Material UI
- Product categories and filtered browsing experience
- Search and discovery flows for product listings
- User registration and login system
- Google OAuth login support
- Real-time messaging with Socket.IO
- Seller and buyer profile pages
- Favorites and saved listings
- Premium/featured ad management
- Dark and light theme support
- Localization support for multiple languages
- Admin tools for moderation and user management
- SEO-friendly pages and structured metadata
- Mobile-ready architecture with Capacitor support

## Tech Stack

### Frontend

| Category | Technology |
|---|---|
| Framework | React 19 |
| Build Tool | Vite |
| Language | TypeScript |
| Routing | React Router DOM |
| UI Library | Material UI + Bootstrap 5 |
| Form Handling | Formik + Yup |
| Real-time Communication | Socket.IO Client |
| Charts | Recharts |
| Icons | Font Awesome + Lucide |
| Notifications | react-toastify |
| Localization | react-i18next |

### Additional Integrations

| Integration | Purpose |
|---|---|
| Capacitor | Android / hybrid app packaging |
| Google OAuth | Social authentication |
| PDF Rendering | Document generation and export |
| Context + Hooks | State management and app logic |

## Prerequisites

Before running the project, make sure you have:

- Node.js 20 or newer
- npm or yarn installed
- A running backend service
- Access to a MongoDB-powered backend or equivalent API service

## Getting Started

### 1) Clone the Repository

```bash
git clone https://github.com/Anismhamid/client.git
cd client
```

### 2) Install Dependencies

```bash
npm install
```

### 3) Configure Environment Variables

Create a `.env` file in the root of the project and add the following values:

```env
VITE_API_URL=http://localhost:8209/api
VITE_SOCKET_URL=http://localhost:8209
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

> If the backend is running on a different port, adjust the values accordingly.

### 4) Run the App in Development Mode

```bash
npm run dev
```

The app should be available at:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8209`

### 5) Build for Production

```bash
npm run build
npm run preview
```

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL for the backend API |
| `VITE_SOCKET_URL` | Real-time Socket.IO server URL |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID used for login |

## Project Structure

```text
client/
├── public/                     # Static assets and public files
├── src/
│   ├── App.tsx                # Main app component
│   ├── main.tsx               # React bootstrap entry
│   ├── assets/                # Images, icons, and static resources
│   ├── atoms/                 # Reusable small UI elements
│   ├── components/            # Feature-rich UI components
│   ├── context/               # App context providers
│   ├── helpers/               # Utility functions
│   ├── hooks/                 # Custom React hooks
│   ├── interfaces/            # TypeScript type definitions
│   ├── locales/               # Language files and localization logic
│   ├── routes/                # Application routing configuration
│   ├── services/              # API and integration services
│   ├── socket/                # Socket.IO-related logic
│   ├── index.css              # Core styling
│   └── ...
├── android/                   # Android project (Capacitor)
├── package.json               # Dependencies and scripts
├── vite.config.ts             # Vite configuration
├── vercel.json                # Deployment config for Vercel
├── tsconfig*.json             # TypeScript configuration
├── README.md                  # Project documentation
├── .gitignore                 # Ignored files
└── LICENSE                    # License file
```

## Main Routes

### Core Pages

| Route | Description |
|---|---|
| `/` | Homepage |
| `/login` | Login page |
| `/register` | Registration page |
| `/profile` | User profile |
| `/messages` | Messaging center |
| `/favorites` | Saved favorite listings |
| `/about` | About page |
| `/contact` | Contact page |
| `/privacy-and-policy` | Privacy policy |
| `/term-of-use` | Terms of use |
| `/discounts-and-offers` | Promotions and offers |

### Product & Category Pages

| Route | Description |
|---|---|
| `/category/cars` | Cars |
| `/category/motorcycles` | Motorcycles |
| `/category/electronics` | Electronics |
| `/category/house` | Home items |
| `/category/garden` | Garden and outdoor |
| `/category/health` | Health and wellness |
| `/category/beauty` | Beauty products |
| `/category/cleaning` | Cleaning essentials |
| `/category/watches` | Watches |
| `/category/women-clothes` | Women’s clothing |
| `/category/men-clothes` | Men’s clothing |

### Admin & Management Pages

| Route | Description |
|---|---|
| `/users-management` | Manage users |
| `/admins` | Admin dashboard |
| `/adsDashboard` | Featured ad dashboard |
| `/reports` | Report management |

## Security & Stability Considerations

This project applies a good baseline of frontend security awareness. Key positive practices include:

- Use of `withCredentials: true` for authenticated API requests
- Centralized client API setup in `src/services/api.ts`
- Automatic logout handling on 401 and 403 responses
- Secure HTTP headers configured in `vercel.json`, including:
  - Content-Security-Policy
  - Strict-Transport-Security
  - X-Content-Type-Options
  - Referrer-Policy
  - Permissions-Policy

However, the strongest protection must still live in the backend. Frontend-only protections are not enough for production-grade security. Critical backend responsibilities include:

- Proper authorization and role checks
- Input validation and sanitization
- Protection against CSRF when using cookies
- JWT/session validation
- Safe handling of user-generated content

Overall, the application is structurally solid and suitable for a marketplace workflow, but production security should be treated as a layered approach: frontend + backend + secure deployment configuration.

## Contributing

Contributions are welcome. To propose changes:

```bash
git checkout -b feature/my-improvement
# make your changes
git add .
git commit -m "Add my improvement"
git push origin feature/my-improvement
```

Then open a pull request from your branch into the main branch.

## License

This project is licensed under the MIT License. See [Licencse.md](./Licencse.md) for more information.

---

Built to support a modern, user-focused, secure, and scalable peer-to-peer marketplace experience.
