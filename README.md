# E-Commerce C2C Marketplace - بيع وشراء

## Project Summary

This is a straightforward e-commerce application allowing users to **browse and buy fresh products** like fruits, vegetables, fish, and dairy. Users can explore product categories, find discounts, add items to their cart, and complete purchases.

---

## Table of Contents

1.  [Project Overview](#project-overview)
2.  [Features](#features)
3.  [Technologies](#technologies)
4.  [File Structure](#file-structure)
5.  [Setup](#setup)
6.  [Usage](#usage)
7.  [Components Overview](#components-overview)
8.  [Services](#services)
9.  [API Integration](#api-integration)
10. [License](#license)
11. [How to Contribute](#how-to-contribute)

---

## Project Overview

This e-commerce platform delivers a variety of fresh products directly from local suppliers. Customers can pick products, see available discounts, and checkout. The application supports multiple payment and collection methods, including credit card, cash on delivery, and self-collection. The checkout process automatically calculates the final price, taking into account product discounts and delivery options.

---

## Features

- **Product Categories:** Displays categories such as Fish, Dairy, Fruits, and Vegetables.
- **Discounts & Offers:** Applies special discounts to specific products.
- **Cart & Checkout:** Users can add products to their cart, view a summary, and select a payment method.
- **Responsive Design:** Optimized for seamless use on both mobile and desktop devices.
- **Authentication:** Provides secure user authentication and token management.
- **Order Management:** Users can place orders with various payment and delivery choices.
- **Receipts Generation:** Automatically generates detailed receipts for each order, including business information, customer details, product lists, delivery fees, and discounts.
- **Export Options:** Users can download PDF receipts directly from the receipts page.
- **Internal Messaging System:**
    - **User Communication:** Clients can message Moderators, while Moderators and Admins can communicate with Clients and other Admins/Moderators.
    - **Real-time Messaging:** Messages are delivered instantly using Socket.IO.
    - **Message Status:** Messages can be flagged as 'warning' or 'important'.
    - **Reply Functionality:** Users can reply to specific messages.
    - **Pagination:** Efficiently loads and displays message history.
- **Real-Time Updates with Socket.IO:**
    - **Order Status Updates:** Customers receive instant notifications about their order status.
    - **Discount Alerts:** Get immediate alerts on new discounts and offers.
    - **Admin/Moderator Notifications:** Real-time alerts for new orders and updates on specific order statuses.

---

## Technologies

### Frontend

- React 19
- Vite
- React Router DOM v7
- State Management with **useState** and **useContext API**
- **Socket.IO Client** for real-time notifications and messaging
- Styling: Bootstrap v5, React Bootstrap, **MUI**, Emotion, Font Awesome, React Toastify, CSS
- **Axios** for API communication
- **Formik & Yup** for forms and validation

### Development & Tooling

- TypeScript
- Vite
- ESLint

### Backend

- [Visit GitHub for Server-side](https://github.com/Anismhamid/server)
- **Express.js**
- **Node.js**
- **MongoDB Atlas** (via Mongoose)

### Real-time Communication

- **Socket.IO** for live updates and notifications, including real-time messaging

### Security & Auth

- **Helmet** for securing HTTP headers
- **express-rate-limit** for request limiting
- **jsonwebtoken (JWT)** for authentication
- **bcryptjs** for password hashing
- **Google OAuth** integration for social login

### Validation & Logging

- **Joi** for request data validation
- Custom logging middleware with file persistence

### Miscellaneous

- **CORS** middleware for cross-origin requests
- Modular RESTful API routing
- Development tools: chalk, express-list-routes, cross-env

---

## Setup

### Prerequisites

- Node.js v20.18.x or higher — [Download Node.js](https://nodejs.org/)
- npm (comes with Node.js)
- MongoDB (local or Atlas) — If local, install [MongoDB Compass](https://www.mongodb.com/try/download/community) and create a database named `fruit-store`
- Postman or Insomnia for API testing

### Installation

```bash
git clone https://github.com/Anismhamid/client.git
```

```bash
npm install
```

### Run the Application on development mod and production mode

**Development mode:**

```bash
npm run dev
```

- Runs the client at - http://localhost:5173

- and the server at - http://localhost:8209</p>

**Production mode:**

```bash
npm run start
```

- Runs the client at - http://localhost:4173

- and the server at - http://localhost:8201

### Usage

- After starting the application, open the browser at- http://localhost:5173 / http://localhost:4173

    - Browse products by categories, add to cart, apply discounts, and place orders.
    - Use the admin panel (login required) to manage products, discounts, and orders.

<section id="components-overview" style="margin-bottom:30px;">
  <h2 style="color:#b22222;">Components Overview</h2>
  <ul>
    <li><strong>Navbar:</strong> Dynamic navigation with category filters, search, login/logout, cart icon, and user profile menu.</li>
    <li><strong>ProductCard:</strong> Displays individual products with image, price, discount, and add-to-cart button.</li>
    <li><strong>Cart:</strong> Shows selected products, quantities, total price, and checkout button.</li>
    <li><strong>CheckoutModal:</strong> Modal window to finalize order with payment and collection options.</li>
    <li><strong>Login/Register forms:</strong> User authentication and registration with validation.</li>
    <li><strong>AdminDashboards:</strong> For managing users, products, orders, discounts, and site content.</li>
    <li>**MessagingPage:** Allows users to send and receive internal messages, with features like recipient selection, reply-to, and message importance.</li>
  </ul>
</section>

<section id="services" style="margin-bottom:30px;">
  <h2 style="color:#b22222;">Services</h2>
  <ul>
    <li><strong>AuthService:</strong> Handles login, registration, JWT storage, and Google OAuth login.</li>
    <li><strong>ProductService:</strong> Fetches products, categories, and manages CRUD operations for admins.</li>
    <li><strong>OrderService:</strong> Places orders, fetches order status, and manages order updates.</li>
    <li><strong>DiscountService:</strong> Retrieves and applies discounts and offers.</li>
    <li>**MessageService:** Manages sending and retrieving messages, including filtering and pagination.</li>
  </ul>
</section>

<section id="api-integration" style="margin-bottom:30px;">
  <h2 style="color:#b22222;">API Integration</h2>
  <p>All data exchange with the backend server is done via RESTful API endpoints secured with JWT tokens.</p>
  <p>Socket.IO is used to receive real-time notifications for order updates and discount announcements.</p>
  <p>**Messaging:** Dedicated API endpoints for sending and retrieving messages, with real-time delivery via Socket.IO.</p>
  <p>Example Axios usage to get products:</p>

```js
import axios from "axios";

const getProducts = async () => {
	try {
		const response = await axios.get("http://localhost:8209/api/products");
		return response.data;
	} catch (error) {
		console.log(error); // Changed consol.log to console.log
	}
};
```

  </section>

  <section id="license" style="margin-bottom:30px;">
    <h2 style="color:#b22222;">License</h2>
    <p>This project is licensed under the MIT License.</p>
  </section>

  <section id="how-to-contribute" style="margin-bottom:30px;">
    <h2 style="color:#b22222;">How to Contribute</h2>
    <ol>
      <li>Fork the repository</li>
      <li>Create your feature branch 
        <code>git checkout -b feature-name</code>
      </li>
      <li>Commit your changes (<code>git commit -m 'Add some feature'</code>)</li>
      <li>Push to the branch (<code>git push origin feature-name</code>)</li>
      <li>Open a pull request</li>
    </ol>
  </section>

</main>
