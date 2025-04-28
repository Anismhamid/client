# Corner Market - E-Commerce Client

## Overview

Fresh food e-commerce platform: fruits, vegetables, fish, dairy & more.  
Real-time updates, discounts, cart management, and receipt generation.

---


## Technologies

| Frontend            | Backend            |
| :------------------ | :----------------- |
| React 19            | Express.js         |
| Vite                | MongoDB Atlas      |
| React Router Dom v7 |                    |
| Axios               | JWT Authentication |
| Socket.IO-Client    | Socket.IO          |
| Formik + Yup        | Joi                |
| React Bootstrap     |                    |
| MUI                 |                    |
| @mui/joy            | bcryptjs           |
| html2canvas         | chalk              |
| jspdf               | cors               |
| jwt-decode          | dotenv             |
| react-toastify      | express-rate-limit |
| swiper              | helmet             |
| radix-ui            | mongoose           |

---

## Key Features

- Product Categories (Fruits, Vegetables, Dairy, etc.)
- Discount Alerts and Offers
- Cart & Checkout Management
- Real-Time Updates (Socket.IO)
- Secure Authentication (JWT)
- Receipt Generation (PDF Download)

---

## Project Setup

```bash
# Clone the client
git clone https://github.com/Anismhamid/client.git

# Install dependencies
npm install

# Run in development
npm run dev
# http://localhost:5173

# Production build
npm run start
# http://localhost:4173
```

---

## 🔗 API Endpoints (server)

| Route                 | Purpose                                                                   |
| :-------------------- | :------------------------------------------------------------------------ |
| `/api/users`          | User registration /POST                                                   |
| `/api/users/login`    | User login /POST                                                          |
| `/api/users/{userId}` | Methods: GET/{Admin/oner} /PUT/PATCH/DELETE{Admin/oner}                   |
| `/api/carts`          | Cart management GET/{Admin/oner} /DELETE{oner}                            |
| `/api/orders`         | Order placement & updates & search PATCH{Admin/Moderator/delivery}:status |
| `/api/products`       | Product listings & search & GET/ PUT{Admin/oner}                          |
| `/api/business-info`  | Business details information                                              |
| `/api/discounts`      | Manage discounts GET/                                                     |
| `/api/receipt`        | Receipt generation GET{Amin}:All                                          |

> Server Repo: [Server GitHub](https://github.com/Anismhamid/server)

---

## 📄 License

MIT License

---
