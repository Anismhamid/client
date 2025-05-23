<main style="padding:10px; max-width:900px; margin:auto; line-height:1.5; border-radius:20px; width:100%; font-family: Arial, sans-serif;">

  <h1 style="text-align:center; color:#b22222; margin-bottom:20px;">E-Commerce Platform - Corner Market</h1>

  <section style="background-color:#fff; padding:15px 20px; border-radius:20px; box-shadow: 0 0 10px rgba(0,0,0,0.05); margin-bottom:30px; text-align:center; color:#222;">
    <h2 style="margin-bottom:10px;">Project Summary</h2>
    <p>
      This is a simple e-commerce application that allows users to browse and purchase various fresh products such as fruits, vegetables, fish, and dairy etc.
      Users can view categories of products, access discounts and offers, add items to the cart, and proceed to checkout.
    </p>
  </section>

  <section style="max-width:500px; font-weight:600; margin:auto; margin-bottom:40px;">
    <h2 style="font-weight:700; margin-bottom:10px;">Table of Contents</h2>
    <ol>
      <li><a href="#project-overview" style="text-decoration:none; color:#b22222;">Project Overview</a></li>
      <li><a href="#features" style="text-decoration:none; color:#b22222;">Features</a></li>
      <li><a href="#technologies" style="text-decoration:none; color:#b22222;">Technologies</a></li>
      <li><a href="#file-structure" style="text-decoration:none; color:#b22222;">File Structure</a></li>
      <li><a href="#setup" style="text-decoration:none; color:#b22222;">Setup</a></li>
      <li><a href="#usage" style="text-decoration:none; color:#b22222;">Usage</a></li>
      <li><a href="#components-overview" style="text-decoration:none; color:#b22222;">Components Overview</a></li>
      <li><a href="#services" style="text-decoration:none; color:#b22222;">Services</a></li>
      <li><a href="#api-integration" style="text-decoration:none; color:#b22222;">API Integration</a></li>
      <li><a href="#license" style="text-decoration:none; color:#b22222;">License</a></li>
      <li><a href="#how-to-contribute" style="text-decoration:none; color:#b22222;">How to Contribute</a></li>
    </ol>
  </section>

  <section id="project-overview" style="margin-bottom:30px;">
    <h2 style="color:#b22222;">Project Overview</h2>
    <p>
      This project is an e-commerce platform that offers a variety of fresh products directly from local suppliers. Customers can select products, view available discounts, and proceed to checkout. The application supports multiple payment and collection methods like credit card, cash on delivery, and self-collection. The checkout process calculates the final price based on product discounts and delivery options.
    </p>
  </section>

  <section id="features" style="margin-bottom:30px;">
    <h2 style="color:#b22222;">Features</h2>
    <ul style="line-height:1.7;">
      <li><strong>Product Categories:</strong> Displays categories such as Fish, Dairy, Fruits, and Vegetables.</li>
      <li><strong>Discounts & Offers:</strong> Special discounts applied to certain products.</li>
      <li><strong>Cart & Checkout:</strong> Users can add products to their cart, view the cart summary, and choose a payment method.</li>
      <li><strong>Responsive Design:</strong> Fully responsive and optimized for both mobile and desktop devices.</li>
      <li><strong>Authentication:</strong> Secure user authentication and token management.</li>
      <li><strong>Order Management:</strong> Users can place orders with different payment and delivery options.</li>
      <li><strong>Receipts Generation:</strong> Automatically generates a detailed receipt for each order, including business info, customer details, product list, delivery fees, and discounts.</li>
      <li><strong>Export Options:</strong> Users can download PDF files directly from the receipts page.</li>
      <li><strong>Real-Time Updates with Socket.IO:</strong>
        <ul>
          <li>Order Status Updates: Customers receive instant updates about their order status.</li>
          <li>Discount Alerts: Instant notifications on new discounts and offers.</li>
          <li>Admin/Moderator Notifications: Real-time alerts for new orders to admins/moderators.</li>
        </ul>
      </li>
    </ul>
  </section>

  <section id="technologies" style="margin-bottom:30px;">
    <h2 style="color:#b22222;">Technologies</h2>
    <h3>Frontend</h3>
    <ul>
      <li>React 19</li>
      <li>Vite</li>
      <li>React Router DOM v7</li>
      <li>State Management with useState and useContext API</li>
      <li>Socket.IO Client for real-time notifications</li>
      <li>Styling: Bootstrap v5, React Bootstrap, MUI, Emotion, Font Awesome, React Toastify, CSS</li>
      <li>Axios for API communication</li>
      <li>Formik & Yup for forms and validation</li>
    </ul>
    <h3>Development & Tooling</h3>
    <ul>
      <li>TypeScript</li>
      <li>Vite</li>
      <li>ESLint</li>
    </ul>
    <h3>Backend</h3>
    <ul>
    <li> <a href="https://github.com/Anismhamid/server" target="_blank" rel="noopere noreferrer" style="text-decoration:none;">viset GitHub for Server-side</a></li>
      <li>Express.js</li>
      <li>Node.js</li>
      <li>MongoDB Atlas (via Mongoose)</li>
    </ul>
    <h3>Real-time Communication</h3>
    <ul>
      <li>Socket.IO for live updates and notifications</li>
    </ul>
    <h3>Security & Auth</h3>
    <ul>
      <li>Helmet for securing HTTP headers</li>
      <li>express-rate-limit for request limiting</li>
      <li>jsonwebtoken (JWT) for authentication</li>
      <li>bcryptjs for password hashing</li>
      <li>Google OAuth integration for social login</li>
    </ul>
    <h3>Validation & Logging</h3>
    <ul>
      <li>Joi for request data validation</li>
      <li>Custom logging middleware with file persistence</li>
    </ul>
    <h3>Miscellaneous</h3>
    <ul>
      <li>CORS middleware for cross-origin requests</li>
      <li>Modular RESTful API routing</li>
      <li>Development tools: chalk, express-list-routes, cross-env</li>
    </ul>
  </section>

  <section id="setup" style="margin-bottom:30px;">
    <h2 style="color:#b22222;">Setup</h2>
    <h3>Prerequisites</h3>
    <ul>
      <li>Node.js v20.18.x or higher — <a href="https://nodejs.org/" target="_blank" rel="noopener noreferrer">Download Node.js</a></li>
      <li>npm (comes with Node.js)</li>
      <li>MongoDB (local or Atlas) — If local, install <a href="https://www.mongodb.com/try/download/community" target="_blank" rel="noopener noreferrer">MongoDB Compass</a> and create database named <code>fruit-store</code></li>
      <li>Postman or Insomnia for API testing</li>
    </ul>
    <h3>Installation</h3>
<pre style="padding:10px; border-radius:6px; overflow-x:auto;">
git clone https://github.com/Anismhamid/client.git
</pre>
<pre style="padding:10px; border-radius:6px; overflow-x:auto;">
npm install
</pre>
    <h3>Running the Application</h3>
    <p><strong>Development mode:</strong></p>
    <pre style="padding:10px; border-radius:6px; overflow-x:auto;">
npm run dev
    </pre>
    <p>Runs the client at <a href="http://localhost:5173" target="_blank" rel="noopener noreferrer">http://localhost:5173</a> and the server at <a href="http://localhost:8209" target="_blank" rel="noopener noreferrer">http://localhost:8209</a></p>
    <p><strong>Production mode:</strong></p>
    <pre style="padding:10px; border-radius:6px; overflow-x:auto;">
npm run start
    </pre>
    <p>Runs the client at <a href="http://localhost:8209" target="_blank" rel="noopener noreferrer">http://localhost:8209</a> serving the static React build.</p>
  </section>

  <section id="usage" style="margin-bottom:30px;">
    <h2 style="color:#b22222;">Usage</h2>
    <p>After starting the application, open the browser at <a href="http://localhost:5173" target="_blank" rel="noopener noreferrer">http://localhost:5173</a>.</p>
    <p>Browse products by categories, add to cart, apply discounts, and place orders.</p>
    <p>Use the admin panel (login required) to manage products, discounts, and orders.</p>
  </section>

  <section id="components-overview" style="margin-bottom:30px;">
    <h2 style="color:#b22222;">Components Overview</h2>
    <ul>
      <li><strong>Navbar:</strong> Dynamic navigation with category filters, search, login/logout, cart icon, and user profile menu.</li>
      <li><strong>ProductCard:</strong> Displays individual products with image, price, discount, and add-to-cart button.</li>
      <li><strong>Cart:</strong> Shows selected products, quantities, total price, and checkout button.</li>
      <li><strong>CheckoutModal:</strong> Modal window to finalize order with payment and collection options.</li>
      <li><strong>Login/Register forms:</strong> User authentication and registration with validation.</li>
      <li><strong>AdminDashboards:</strong> For managing users, products, orders, discounts, and site content.</li>
    </ul>
  </section>

  <section id="services" style="margin-bottom:30px;">
    <h2 style="color:#b22222;">Services</h2>
    <ul>
      <li><strong>AuthService:</strong> Handles login, registration, JWT storage, and Google OAuth login.</li>
      <li><strong>ProductService:</strong> Fetches products, categories, and manages CRUD operations for admins.</li>
      <li><strong>OrderService:</strong> Places orders, fetches order status, and manages order updates.</li>
      <li><strong>DiscountService:</strong> Retrieves and applies discounts and offers.</li>
    </ul>
  </section>

  <section id="api-integration" style="margin-bottom:30px;">
    <h2 style="color:#b22222;">API Integration</h2>
    <p>All data exchange with the backend server is done via RESTful API endpoints secured with JWT tokens.</p>
    <p>Socket.IO is used to receive real-time notifications for order updates and discount announcements.</p>
    <p>Example Axios usage to get products:</p>

```js
import axios from "axios";

const getProducts = async () => {
	try {
		const response = await axios.get("http://localhost:8209/api/products");
		return response.data;
	} catch (error) {
		consol.log(error);
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
