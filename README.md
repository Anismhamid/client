# E-Commerce Platform - Corner Market (Client-Side)

## Overview

This is a simple e-commerce application that allows users to browse and purchase various fresh products such as fruits, vegetables, fish, and dairy, among others. The platform offers a range of features such as product categories, discounts, cart management, checkout, and real-time updates.

## Features

- **Product Categories**: Displays products in categories like Fruits, Vegetables, Dairy, Fish, Meat, Spices, Beverages, etc.
- **Discounts & Offers**: Special discounts are available for some products.
- **Cart & Checkout**: Users can add products to their cart, view the cart summary, and proceed to checkout.
- **Responsive Design**: Optimized for both mobile and desktop devices.
- **Authentication**: Secure user authentication for login.
- **Receipts Generation**: Automatically generates a receipt after checkout with details such as business info, order info, and discounts.
- **PDF Export**: Users can download receipts as PDF files.
- **Socket.IO Real-Time Updates**:
    - Order status updates are sent instantly (e.g., "Order Processed", "Out for Delivery").
    - Instant discount and offer alerts.
    - Admin/Moderator notifications for new orders.

## Technologies

### Frontend

- **React 19**: JavaScript framework for building the UI.
- **Vite**: Build tool used to bundle the app efficiently.
- **React Router DOM v7**: For handling navigation between different pages.
- **State Management**:
    - `useState`, `useContext`
    - Real-time updates using **Socket.IO Client** for notifications.
- **Styling & UI**:
    - **React Bootstrap** and **Material UI** for UI components.
    - **Font Awesome** for icons.
    - **React Toastify** for notifications.
- **API Communication**: Axios for making requests to the backend API.
- **Form Handling & Validation**:
    - **Formik** for forms.
    - **Yup** for data validation.

### Backend (For Reference)

- **Express.js**: Backend framework.
- **MongoDB Atlas**: Cloud database using Mongoose.
- **Socket.IO**: For real-time communication between client and server.
- **JWT Authentication**: For secure user login.

## New Features Added

- **Receipts Generation & PDF Export**: After completing a purchase, users can download a receipt detailing the transaction, including product names, quantities, total amounts, and applicable discounts.

    - The receipt includes:
        - Business Information (name, address, contact details)
        - Customer Details (name, contact)
        - List of Products (with quantity and price)
        - Delivery Fee (if applicable)
        - Discounts Applied
        - Total Amount Due

- **Real-Time Updates with Socket.IO**:
    - **Order Status Updates**: Users are notified instantly about changes in their order status.
    - **Discount Alerts**: Instant notifications when discounts are available.
    - **Admin Notifications**: Admins are alerted when new orders are placed, allowing them to manage orders efficiently.

## Development Setup

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v20.18.x or higher): [Download Node.js](https://nodejs.org/)
- **npm**: Node Package Manager (installed with Node.js)
- **MongoDB**: You can use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or install [MongoDB Compass](https://www.mongodb.com/try/download/community) for local development.
- **Postman/Insomnia**: For API testing, download [Postman](https://www.postman.com/downloads/) or [Insomnia](https://insomnia.rest/download).

### Installation

Clone the repository:

```bash
git clone https://github.com/Anismhamid/client.git
```

Navigate to the project folder:

```bash
npm install
```

Run the Application

Development Mode:

```bash
npm run dev
```

- Client runs on: http://localhost:5173

- Server runs on: http://localhost:8209

```bash
npm run start
```

- Client runs on: http://localhost:4173

- Server runs on: http://localhost:8201

# Key Components Overview

## **Cart**

- Allows users to manage items in their cart (add, remove, update quantities).

## **Checkout**

- Handles the checkout process, allowing users to select delivery methods, apply discounts, and see the final cost.

## **Receipt**

- Shows a detailed receipt after checkout and provides an option to download the receipt as a PDF.

## **Product Categories**

- Dynamic display of product categories such as Fruits, Vegetables, Dairy, Fish, etc.

## **Real-Time Updates**

- Socket.IO enables live updates for order statuses, new discounts, and admin notifications.

# **API Integration**

### Routes

- Below are the routes that handle different functionalities in the application:

1. **`/api/users`**

    - Manages user-related operations, such as registration, login, and updating user details.

    - Methods:
        - GET / POST / PUT / PATCH / DELETE

2. **`/api/carts`**

    - Manages the shopping cart, including adding or removing products from the cart.

    - Methods:
        - GET / POST / DELETE

3. **`/api/orders`**

    - Handles order management, such as placing a new order and retrieving order details.

    - Methods:
        - GET / POST / PUT / PATCH

4. **`/api/products`**

    - Manages products, such as fetching product listings, searching for products, and updating product details.

    - Methods:
        - GET / POST / PUT / PATCH

5. **`/api/business-info`**

    - Provides business-related information, such as the business name, address, and contact details.

    - Methods:
        - GET / PUT

6. **`/api/discounts`**

    - Manages discounts and offers, such as retrieving available discounts or creating new ones.

    - Methods:
        - GET / POST / PUT / PATCH / DELETE

7. **`/api/receipt`**

    - Handles receipt or invoice generation for completed orders, such as creating or retrieving receipts for previous orders.

    - Methods:
        - GET / POST / PUT / PATCH / DELETE

## License

This project is licensed under the MIT License - see the LICENSE file for details.