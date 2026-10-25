# Safqa Marketplace — C2C Marketplace Frontend

<p align="center">
  <strong>
    An Arabic-first, multilingual marketplace for buying, selling,
    and discovering opportunities.
  </strong>
  <br />
  Built with React, TypeScript, and Vite.
</p>

<p align="center">
  <img alt="React 19" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" />
  <img alt="TypeScript 5" src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" />
  <img alt="Vite 6" src="https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white" />
  <img alt="Socket.IO" src="https://img.shields.io/badge/Socket.IO-Realtime-010101?logo=socketdotio&logoColor=white" />
  <img alt="Capacitor 8" src="https://img.shields.io/badge/Capacitor-8-119EFF?logo=capacitor&logoColor=white" />
  <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-green.svg" />
</p>

Safqa is a consumer-to-consumer (C2C) marketplace frontend that enables users to discover listings, publish advertisements, interact with sellers, manage their accounts, and explore job opportunities.

The interface supports Arabic, Hebrew, and English, including right-to-left (RTL) layouts.

This repository contains the frontend application. Marketplace data, authentication services, and other server-side operations depend on the separately deployed backend.

- **Frontend repository:** [Anismhamid/client](https://github.com/Anismhamid/client)
- **Backend repository:** [Anismhamid/server](https://github.com/Anismhamid/server)
- **Production frontend:** [Safqa on Vercel](https://client-qqq1.vercel.app)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Requirements](#requirements)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Build and Bundle Analysis](#build-and-bundle-analysis)
- [Android App](#android-app-capacitor)
- [Project Structure](#project-structure)
- [Application Routes](#application-routes)
- [Admin Center](#admin-center)
- [Jobs Platform](#jobs-platform)
- [Security Notes](#security-notes)
- [Contributing](#contributing)
- [License](#license)

## Overview

Safqa is designed to facilitate direct interactions between buyers and sellers without an in-platform middleman.

Users can browse listings, explore categories, search for products, publish advertisements, save favorites, view seller profiles, and communicate through the application's messaging experience.

The frontend also includes a jobs platform, a blog, account-management features, and an administrative workspace.

Marketplace categories include areas such as:

- Vehicles and mobility
- Electronics and gaming
- Home, garden, and furniture
- Clothing, bags, watches, and accessories
- Health, beauty, and everyday products
- Cameras, books, and musical instruments
- Construction, industrial, welding, and office equipment
- Services

The available listings, category specifications, and user actions depend on the backend API, application configuration, and account permissions.

## Features

### Marketplace

- Responsive marketplace interface
- Category-based listing discovery
- Search and category navigation
- Listing details and seller profiles
- Favorites and saved searches
- Featured advertisements and promotional sections
- Discounts and offers
- Listing management dashboard
- Support for multiple product categories

### Authentication and Accounts

- Registration and login pages
- Google OAuth integration
- User profile management
- Public customer profiles
- Account deletion interface
- Blocked-user management
- Role-aware administrative navigation

Authentication and authorization behavior depends on the frontend authentication logic and backend enforcement.

### Messaging and Notifications

- Messaging interfaces
- User-to-user chat
- Socket.IO client integration
- Administrative notification management
- Notification sending and sent-notification views
- Message audit-log and investigation interfaces

The availability of individual messaging and notification capabilities depends on the backend implementation and user permissions.

### Jobs Platform

- Job listings
- Job details
- Job creation and editing
- Administrative job management
- Job-related search and filtering where supported by the current implementation

### Blog

- Blog listing page
- Individual article pages
- Article creation and editing
- Blog management interface

### Administration

- Centralized administration layout
- Dashboard
- User management
- Listing moderation
- Job management and job details
- Reports management
- Blocked-user management
- Message audit logs
- Message investigation
- Notification sending and history
- Administrative settings

Administrative pages are protected by a frontend guard that checks authentication and the `Admin` or `Moderator` role. Backend authorization is also required for security.

### Platform and Localization

- Arabic, Hebrew, and English localization
- RTL layout support
- Responsive layouts
- Light and dark themes where implemented
- Capacitor-based Android integration
- SEO metadata and structured-data support where implemented

## Technology Stack

| Area                      | Technology                            |
| ------------------------- | ------------------------------------- |
| UI framework              | React 19                              |
| Language                  | TypeScript 5                          |
| Build tool                | Vite 6                                |
| Routing                   | React Router DOM 7                    |
| UI components             | Material UI 7, MUI Joy UI, MUI Lab    |
| Styling                   | Emotion, Bootstrap 5, React Bootstrap |
| Forms and validation      | Formik, Yup                           |
| HTTP client               | Axios                                 |
| Real-time communication   | Socket.IO Client 4                    |
| Internationalization      | i18next, react-i18next                |
| Animations                | Framer Motion                         |
| Charts                    | Recharts                              |
| Icons                     | Font Awesome, Lucide React, MUI Icons |
| Notifications and dialogs | React Toastify, SweetAlert2           |
| Date utilities            | Day.js                                |
| PDF rendering             | @react-pdf/renderer                   |
| Image capture             | html2canvas                           |
| Image zoom                | react-zoom-pan-pinch                  |
| Markdown                  | marked                                |
| HTML sanitization         | DOMPurify                             |
| Google authentication     | @react-oauth/google                   |
| Android runtime           | Capacitor 8                           |
| Native social login       | @capgo/capacitor-social-login         |
| Native push notifications | @capacitor/push-notifications         |
| Build analysis            | rollup-plugin-visualizer              |
| Deployment performance    | @vercel/speed-insights                |

The application also uses React Context, custom hooks, and supporting libraries for shared state and application logic.

Dependency versions are declared in `package.json`. The exact installed versions depend on the lockfile and installation environment.

## Requirements

For frontend development:

- Node.js compatible with the installed Vite version
- npm
- Access to the Safqa backend API for features that require server data
- Google OAuth client configuration if Google sign-in is enabled

For Android builds:

- Android Studio
- Android SDK and compatible build tools
- Java Development Kit compatible with the Android Gradle configuration
- The Android Gradle Wrapper included in the project

Check the project's Android Gradle files and Capacitor configuration for the required Java and Android SDK versions.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Anismhamid/client.git
cd client
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root if these variables are referenced by the current application code:

```env
VITE_API_URL=http://localhost:8209/api
VITE_SOCKET_URL=http://localhost:8209
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

Replace the example values with the appropriate URLs and credentials for your environment.

Run the backend separately when developing against a local API.

**Important:** Vite exposes variables prefixed with `VITE_` to client-side code. Never store private API keys, signing secrets, database credentials, or other server-side secrets in these variables.

Verify the variable names against the frontend source code and deployment configuration before using this example.

### 4. Start the development server

```bash
npm run dev
```

Vite commonly serves the development application at:

`http://localhost:5173`

The actual port may differ if the default port is unavailable or the Vite configuration changes.

### 5. Build for production

```bash
npm run build
```

The production build is written to the `dist` directory.

### 6. Preview the production build

```bash
npm run preview
```

Run `npm run build` first. The preview command serves the generated production build for local testing; it is not a replacement for a production hosting platform.

## Environment Variables

Create a `.env` file in the root directory of the project and configure the following variables:

```env
VITE_API_URL=your_server_api/api
VITE_API_SOCKET_URL=your_server_api - without => /api
VITE_API_GOOGLE_API=your_google_client_id
VITE_API_VIREFY_TOKEN=your_google_verification_url
VITE_API_CLOUDINARY_UPLOADIMAGE_URL=your_cloudinary_upload_url
VITE_API_CLOUDINARY_UPLOADIMAGE_NAME=your_cloudinary_configuration_name
```

### Variables Description

| Variable                               | Description                                                             |
| -------------------------------------- | ----------------------------------------------------------------------- |
| `VITE_API_URL`                         | Base URL for backend API requests.                                      |
| `VITE_API_SOCKET_URL`                  | Backend server URL used for Socket.IO connections.                      |
| `VITE_API_GOOGLE_API`                  | Google client ID or API configuration, depending on the implementation. |
| `VITE_API_VIREFY_TOKEN`                | Verification-related URL or configuration.                              |
| `VITE_API_CLOUDINARY_UPLOADIMAGE_URL`  | Cloudinary image-upload endpoint.                                       |
| `VITE_API_CLOUDINARY_UPLOADIMAGE_NAME` | Cloudinary configuration name used by the application.                  |

> **Security note:** Vite exposes variables prefixed with `VITE_` in the client-side bundle. Never store private API keys, client secrets, or other confidential credentials in these variables.

## Available Scripts

The following scripts are defined in `package.json`.

| Command                 | Description                                                       |
| ----------------------- | ----------------------------------------------------------------- |
| `npm run dev`           | Start the Vite development server                                 |
| `npm run build`         | Build the frontend for production                                 |
| `npm run lint`          | Run ESLint                                                        |
| `npm run preview`       | Preview the production build                                      |
| `npm run start`         | Build the frontend and then run Vite preview                      |
| `npm run version:auto`  | Execute the automatic versioning script                           |
| `npm run android:sync`  | Synchronize the Capacitor Android project                         |
| `npm run android:build` | Build the frontend, sync Android, and run the release bundle task |
| `npm run android:open`  | Open the Android project in Android Studio                        |
| `npm run release`       | Run automatic versioning followed by the Android release build    |

**Platform note:** The current `android:build` script uses `gradlew.bat`, which is the Windows Gradle Wrapper launcher. On macOS or Linux, use the appropriate `./gradlew` command or adapt the script for the target operating system.

## Build and Bundle Analysis

The project uses Vite with `@vitejs/plugin-react` and `rollup-plugin-visualizer`.

The Vite configuration specifies:

- Production output directory: `dist`
- Base path: `/`
- React integration through `@vitejs/plugin-react`
- Rollup chunk-splitting rules through `manualChunks`
- Bundle visualization in HTML format
- Raw bundle-analysis output in JSON format
- Gzip and Brotli size reporting where configured
- A development-server `Cross-Origin-Opener-Policy` response header

The visualizer is configured to write reports to:

- `stats/stats.html` — interactive bundle visualization
- `stats/stats.json` — raw bundle-analysis data

These reports are generated during builds when the visualizer plugin runs successfully. Their actual contents depend on the build and dependency graph.

The chunk-splitting configuration attempts to separate React-related dependencies from UI-library dependencies. Verify the regular expressions in `vite.config.ts` and inspect the generated report to confirm that the intended chunks are produced.

## Android App (Capacitor)

Safqa uses Capacitor to integrate the web application with an Android project.

### Synchronize Android

```bash
npm run android:sync
```

### Build a release App Bundle

```bash
npm run android:build
```

This script:

1. Builds the frontend.
2. Synchronizes the Capacitor Android project.
3. Runs Gradle's `bundleRelease` task.

The generated Android App Bundle is normally located under:

`android/app/build/outputs/bundle/release/`

Confirm the actual output path and signing configuration in the Android project.

### Open Android Studio

```bash
npm run android:open
```

### Run the release workflow

```bash
npm run release
```

This executes the automatic versioning script and then the Android release build.

Before publishing to Google Play, verify the application ID, version code, version name, signing configuration, permissions, and release behavior.

## Project Structure

The following is a high-level overview. Some directories and files may differ as the project evolves.

```text
client/
├── public/                 # Static assets
├── src/
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Application entry point
│   ├── assets/             # Images, icons, and other assets
│   ├── atoms/              # Reusable UI elements
│   ├── components/         # Pages and feature components
│   ├── context/            # React context providers
│   ├── helpers/            # Utility functions
│   ├── hooks/              # Custom React hooks
│   ├── interfaces/         # TypeScript interfaces and types
│   ├── locales/            # Localization resources
│   ├── routes/             # Route definitions and constants
│   ├── services/           # API and integration services
│   └── socket/             # Socket.IO logic
├── android/                # Capacitor Android project
├── package.json
├── vite.config.ts
├── vercel.json             # Deployment configuration, if present
├── LICENSE
└── README.md
```

## Application Routes

The routes below are based on the supplied `AppRoutes.tsx`. Access to some pages or operations may depend on authentication, account permissions, or backend authorization.

### Public and General Pages

| Route                 | Description    |
| --------------------- | -------------- |
| `/`                   | Home           |
| `/login`              | Login          |
| `/register`           | Registration   |
| `/about`              | About Safqa    |
| `/contact`            | Contact        |
| `/privacy-and-policy` | Privacy policy |
| `/term-of-use`        | Terms of use   |
| `/search`             | Search         |
| `/saved-searches`     | Saved searches |

### User Account

| Route                   | Description                |
| ----------------------- | -------------------------- |
| `/profile`              | User profile               |
| `/profile/:id`          | Profile by ID              |
| `/users/customer/:slug` | Public customer profile    |
| `/favorites`            | Favorite listings          |
| `/blocked-users`        | Blocked users              |
| `/delete-account`       | Account deletion interface |

### Marketplace and Listings

| Route                                    | Description                    |
| ---------------------------------------- | ------------------------------ |
| `/category/:category/:subCategory?`      | Category listings              |
| `/posts/:postId`                         | Listing details by ID          |
| `/:sellerSlug/posts/:category/:postSlug` | Seller-based listing URL       |
| `/posts/:category/:brand/:postId`        | Category and brand listing URL |
| `/my-ads-dashboard`                      | User's ad dashboard            |
| `/adsDashboard`                          | Featured ads dashboard         |
| `/featured-ads`                          | Homepage featured section      |
| `/discounts-and-offers`                  | Discounts and offers           |
| `/isPending`                             | Pending-posts interface        |
| `/payment/success`                       | Payment success page           |

The `/isPending` route is registered separately from the nested admin routes. Do not rely on the route name alone as a security boundary; sensitive operations must be authorized by the backend.

### Messaging

| Route            | Description        |
| ---------------- | ------------------ |
| `/messages`      | Messages interface |
| `/chat`          | User-to-user chat  |
| `/messages/chat` | Chat messages page |

### Jobs

| Route            | Description  |
| ---------------- | ------------ |
| `/jobs`          | Job listings |
| `/jobs/:id`      | Job details  |
| `/jobs/create`   | Create a job |
| `/jobs/:id/edit` | Edit a job   |

### Blog

| Route            | Description           |
| ---------------- | --------------------- |
| `/blog`          | Blog listing          |
| `/blog/:slug`    | Blog article          |
| `/blog/new`      | Create a blog article |
| `/blog/edit/:id` | Edit a blog article   |
| `/blog/manage`   | Blog management       |

### Help and Password Recovery

| Route                    | Description       |
| ------------------------ | ----------------- |
| `/help/selling`          | Selling help      |
| `/help/safety`           | Safety help       |
| `/help/disputes`         | Disputes help     |
| `/password-recover`      | Password recovery |
| `/reset-password/:token` | Password reset    |

### Admin Center

Administrative pages are nested under `/admin` and wrapped by `AdminGuard`.

| Route                           | Description                                   |
| ------------------------------- | --------------------------------------------- |
| `/admin`                        | Admin dashboard                               |
| `/admin/users`                  | User management                               |
| `/admin/posts`                  | Listing moderation                            |
| `/admin/jobs`                   | Job management                                |
| `/admin/jobs/:jobId`            | Admin job details                             |
| `/admin/reports`                | Reports management                            |
| `/admin/security`               | Redirects to the audit-log page               |
| `/admin/security/blocked`       | Blocked-user management                       |
| `/admin/security/audit-logs`    | Message audit logs                            |
| `/admin/security/investigation` | Message investigation                         |
| `/admin/notifications`          | Notification management, redirects to sending |
| `/admin/notifications/send`     | Send notifications                            |
| `/admin/notifications/sent`     | Sent notifications                            |
| `/admin/settings`               | Administrative settings                       |

The supplied route configuration redirects several legacy administrative URLs to their newer destinations.

Routes for notification templates, standalone role management, and standalone permission management are not registered in the supplied `AppRoutes.tsx` and are therefore not listed as active routes here.

## Admin Center

The administrative workspace provides interfaces for managing platform operations, including:

- Dashboard and user management
- Listing moderation
- Job management
- Reports
- Blocked users
- Message audit logs and investigations
- Notification sending and history
- Administrative settings

### Frontend Route Guard

`AdminGuard` uses the authentication state from `useUser()`.

It:

1. Displays a loader while authentication is loading.
2. Redirects unauthenticated users to `/login`.
3. Redirects authenticated users without the `Admin` or `Moderator` role to the home page.
4. Renders the protected admin layout for authorized roles.

This frontend guard improves navigation and user experience. It does not replace backend authorization.

## Jobs Platform

The jobs experience is integrated into the marketplace frontend and includes:

- Job listings
- Job detail pages
- Job creation
- Job editing
- Administrative job management

Available fields, filtering options, and actions depend on the current component implementation, API contract, and user permissions.

## Security Notes

The frontend interacts with a separate backend. Security-sensitive operations must be validated and authorized server-side.

Important considerations include:

- Validate authentication and session or token state on the backend.
- Enforce roles and permissions for protected operations.
- Validate incoming data on the server.
- Safely render user-generated content.
- Configure CORS and cookies appropriately for the deployed origins.
- Apply appropriate CSRF protections when cookie-based authentication is used.
- Protect administrative actions and sensitive message data.
- Avoid exposing private credentials in client-side environment variables.
- Review deployment headers and content-security settings before relying on them.

Frontend route guards and hidden UI controls are not security boundaries. The backend must independently enforce access to protected data and operations.

## Contributing

Contributions, bug reports, and improvements are welcome.

### Suggested workflow

1. Fork the repository.
2. Create a feature branch.
3. Make and test your changes.
4. Run the linter and production build.
5. Submit a pull request describing the changes.

```bash
git checkout -b feature/my-improvement

# Make your changes

npm run lint
npm run build

git add .
git commit -m "Describe your change"
git push origin feature/my-improvement
```

Open a pull request against the appropriate target branch and include the motivation, implementation details, and testing performed.

## License

This project is licensed under the MIT License.

Copyright (c) 2025 Anis.

See the [LICENSE](LICENSE) file for the full license text.
