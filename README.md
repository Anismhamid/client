# Shok Habena Market – E-Commerce Client

## 🛒 Overview

Fresh food e-commerce platform featuring fruits, vegetables, fish, dairy, and more.  
Includes real-time updates, discount alerts, secure cart and checkout management, and PDF receipt generation.

---

## ⚙️ Technologies

| Frontend            | Backend            |
| ------------------- | ------------------ |
| React 19            | Express.js         |
| Vite                | MongoDB Atlas      |
| React Router Dom v7 | JWT Authentication |
| Axios               | Socket.IO          |
| Socket.IO-Client    | Joi                |
| Formik + Yup        | bcryptjs           |
| React Bootstrap     | cors               |
| MUI                 | dotenv             |
| @mui/joy            | helmet             |
| html2canvas         | mongoose           |
| jspdf               | chalk              |
| jwt-decode          | express-rate-limit |
| react-toastify      |                    |
| swiper              |                    |
| radix-ui            |                    |

---

## 🌟 Key Features

- Product Categories (Fruits, Vegetables, Dairy, etc.)
- Discount Alerts and Limited-Time Offers
- Cart and Checkout Management
- Real-Time Updates with Socket.IO
- JWT-Based Secure Authentication
- Receipt Generation as PDF

---

## 🚀 Project Setup

```bash

# Clone the client

git clone https://github.com/Anismhamid/client.git

# Navigate to the project folder

cd client

# Install dependencies

npm install

# Run in development mode

npm run dev

# App will run on http://localhost:5173

# Build for production and preview

npm run start

# The preview will run at http://localhost:4173

```

---

## 🔗 API Endpoints (Server)

| Route                   | Purpose                                                                  |
| ----------------------- | ------------------------------------------------------------------------ |
| \`/api/users\`          | User registration (POST)                                                 |
| \`/api/users/login\`    | User login (POST)                                                        |
| \`/api/users/{userId}\` | Get, update, or delete user (Admin/Owner only)                           |
| \`/api/carts\`          | Get or delete cart (Admin/Owner only)                                    |
| \`/api/orders\`         | Place, update, or search orders (Status updates: Admin/Moderator/Driver) |
| \`/api/products\`       | Get, search, or manage products (GET/PUT for Admin/Owner)                |
| \`/api/business-info\`  | Business details info                                                    |
| \`/api/discounts\`      | Get available discounts                                                  |
| \`/api/receipt\`        | Generate receipts (Admin only)                                           |

> **Server Repo:** [https://github.com/Anismhamid/server](https://github.com/Anismhamid/server)

---

## 📄 License

### MIT License

> Server Repository: [Server GitHub](https://github.com/Anismhamid/server)

---

# License for Shok Habena Market

## MIT License
