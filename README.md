# Safqa Marketplace | C2C Marketplace Frontend

A modern consumer-to-consumer marketplace frontend built with React, TypeScript, and Vite, designed to enable users to buy and sell products securely and effortlessly across multiple categories.

Safqa supports user authentication, real-time chat, ad management, product discovery, jobs, notifications, moderation, and role-based administration in a responsive, mobile-friendly experience.

![React](https://img.shields.io/badge/React-19-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6-646cff?logo=vite)
![Socket.io](https://img.shields.io/badge/Socket.io-4-010101?logo=socket.io)
![License](https://img.shields.io/badge/License-MIT-green)

This client app connects to a backend API and event server to provide a complete marketplace experience for users, sellers, and administrators.

Backend repository: [github.com/Anismhamid/server](https://github.com/Anismhamid/server)

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Main Routes](#main-routes)
- [Jobs Platform](#jobs-platform)
- [Admin Center](#admin-center)
- [Security & Stability Considerations](#security--stability-considerations)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Safqa Marketplace is a feature-rich frontend for a C2C trading platform that helps people discover, list, and negotiate the sale of products in a trusted and streamlined way.

It supports a wide variety of listings including:

- Vehicles
- Electronics
- Home and garden items
- Fashion and accessories
- Health and beauty products
- Everyday essentials
- Miscellaneous goods
- Services
- Jobs

The frontend includes multiple user journeys, from browsing and filtering listings to messaging sellers, managing favorites, creating ads, viewing profiles, discovering jobs, and interacting with administrative tools.

---

## Key Features

### Marketplace

- Responsive marketplace UI built with React and Material UI
- Product categories and filtered browsing experience
- Search and discovery flows for product listings
- Product details and seller profiles
- Favorites and saved listings
- Premium and featured ad management
- Product sharing and external navigation integrations
- Responsive mobile and desktop experience

### Authentication & Accounts

- User registration and login
- Google OAuth login support
- Role-based access control
- Account status management
- Permission-based feature access
- User profile management

### Messaging

- Real-time messaging with Socket.IO
- Conversation management
- Message editing and deletion
- Read and delivery states
- Typing indicators
- Unread message indicators
- Push notification integration

### Jobs

- Jobs marketplace
- Job listing creation and management
- Job search
- Filtering
- Pagination
- Job details pages
- User-based job retrieval
- Administrative job management

### Administration

- Centralized Admin Center
- User management
- Advertisement moderation
- Reports and moderation
- Jobs administration
- Notification Center
- Message Audit Logs
- User Blocks management
- Role and permission management
- Backend-enforced administrative authorization
- Pagination and filtering for administrative datasets

### Platform

- Dark and light theme support
- Arabic, Hebrew, and English localization
- SEO-friendly pages and structured metadata
- Capacitor-based Android application support
- Responsive and mobile-first architecture

---

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
| Context + Hooks | State management and application logic |

---

## Prerequisites

Before running the project, make sure you have:

- Node.js 20 or newer
- npm or yarn installed
- A running backend service
- Access to a MongoDB-powered backend or equivalent API service

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Anismhamid/client.git
cd client
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root of the project:

```env
VITE_API_URL=http://localhost:8209/api
VITE_SOCKET_URL=http://localhost:8209
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

If the backend is running on a different port or host, adjust the values accordingly.

### 4. Run the App in Development Mode

```bash
npm run dev
```

The application should be available at:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8209`

### 5. Build for Production

```bash
npm run build
npm run preview
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL for the backend API |
| `VITE_SOCKET_URL` | Real-time Socket.IO server URL |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID used for login |

---

## Project Structure

```text
client/

├── public/                    # Static assets and public files
├── src/
│   ├── App.tsx                # Main app component
│   ├── main.tsx               # React bootstrap entry
│   ├── assets/                # Images, icons, and static assets
│   ├── atoms/                 # Reusable small UI elements
│   ├── components/            # Feature-rich UI components
│   ├── context/               # Application context providers
│   ├── helpers/               # Utility functions
│   ├── hooks/                 # Custom React hooks
│   ├── interfaces/            # TypeScript type definitions
│   ├── locales/               # Localization files
│   ├── routes/                # Application routing configuration
│   ├── services/              # API and integration services
│   ├── socket/                # Socket.IO-related logic
│   ├── index.css              # Core styling
│   └── ...
│
├── android/                   # Android project (Capacitor)
├── package.json               # Dependencies and scripts
├── vite.config.ts             # Vite configuration
├── vercel.json                # Deployment configuration
├── tsconfig*.json             # TypeScript configuration
├── README.md                  # Project documentation
├── .gitignore                 # Ignored files
└── LICENSE                    # License file
```

---

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
| `/category/women-clothes` | Women's clothing |
| `/category/men-clothes` | Men's clothing |

### Admin & Management Pages

| Route | Description |
|---|---|
| `/users-management` | User and account management |
| `/admins` | Admin Center |
| `/adsDashboard` | Featured ad dashboard |
| `/reports` | Report and moderation management |

> Additional administrative modules such as Jobs, Notifications, Audit Logs, Blocks, and Permissions are integrated into the Admin Center according to the application's current route configuration.

---

## Jobs Platform

Safqa provides a dedicated jobs platform integrated into the marketplace ecosystem.

### Features

- Job listing creation and management
- Job search
- Filtering
- Pagination
- Job details pages
- User-based job retrieval
- Administrative job management
- Role-based access control
- Responsive jobs interface

The jobs platform is designed to allow users to discover and manage employment opportunities while providing administrators with dedicated management tools.

---

## Admin Center

Safqa includes a centralized Admin Center designed to provide secure and efficient platform management.

### Administration Features

- User and account management
- Role-based access control
- Granular permission management
- Product and advertisement moderation
- Job listing management
- Reports and moderation workflows
- Administrative notification management
- Message Audit Logs
- User Blocks management
- Pagination and filtering
- Administrative actions protected by backend authorization
- Auditability of sensitive administrative operations

### Roles

The platform supports role-based administration, including:

- `Admin`
- `Moderator`
- `Client`
- `delivery`

### Permissions

Administrative permissions are enforced on the backend and reflected in the frontend UI.

Examples include:

- `canLogin`
- `canUseAccount`
- `canCreatePosts`
- `canSendMessages`
- `canSendOffers`
- `canAccessExistingData`
- `canViewMessageAuditLogs`

Frontend permission checks are primarily used to provide an appropriate user experience.

The backend remains the source of truth for authorization and security.

### Notification Center

The Admin Center includes a centralized notification management system.

Features include:

- Send notifications to individual users
- Send notifications to multiple users
- Broadcast notifications
- Notification title and message
- Optional related post or resource
- Notification preview
- Notification history
- Permission-protected administrative actions

### Message Audit Logs

Sensitive message-related administrative activity can be tracked through audit logs.

The audit system supports:

- Administrative access tracking
- Conversation-related audit events
- Administrator identification
- Target user identification
- Conversation identification
- Timestamped actions
- Permission-controlled access

### Blocks Management

Administrative block management provides tools for reviewing and managing user blocking relationships.

Features include:

- View blocking relationships
- Search and filtering
- Review blocker and blocked users
- Administrative unblock actions
- Permission-protected operations
- Administrative auditing

---

## Security & Stability Considerations

This project applies a layered security approach.

### Frontend Security

Key practices include:

- `withCredentials: true` for authenticated API requests
- Centralized API configuration in `src/services/api.ts`
- Automatic authentication handling for unauthorized responses
- Role and permission-aware UI
- Secure HTTP headers configured in `vercel.json`

Configured security headers include:

- Content-Security-Policy
- Strict-Transport-Security
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy

### Backend Authorization

Frontend protection is not considered sufficient for sensitive operations.

Critical authorization responsibilities remain on the backend, including:

- Authentication validation
- Role checks
- Permission checks
- Account status validation
- Input validation
- Input sanitization
- CSRF protection when cookie-based authentication is used
- JWT/session validation
- Safe handling of user-generated content
- Administrative authorization
- Audit logging for sensitive operations

Administrative requests should be validated using the authenticated user's identity, role, account status, and required permissions.

---

## Contributing

Contributions are welcome.

To propose changes:

```bash
git checkout -b feature/my-improvement

# make your changes

git add .
git commit -m "Add my improvement"

git push origin feature/my-improvement
```

Then open a pull request from your branch into the `main` branch.

---

## License

This project is licensed under the MIT License.

See [LICENSE](./LICENSE) for more information.

---

Built to support a modern, user-focused, secure, and scalable peer-to-peer marketplace experience.