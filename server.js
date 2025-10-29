
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bcrypt = require('bcrypt');
const pool = require("./src/configs/db"); 
const userRoutes = require("./src/routers/users");
const authRoutes = require("./src/routers/authroutes");
const productRoutes = require("./src/routers/products");
const suggestionRoutes = require('./src/routers/suggestion_routes');
const cartRoutes = require('./src/routers/cart_router');
const cartItemRoutes = require('./src/routers/cartItem_router');
const customerRoutes = require('./src/routers/customer_router');

const app = express();
const PORT = process.env.PORT || 5000;
const nodemailer = require('nodemailer');


// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.get("/", (req, res) => {
  res.send("Backend server is running");
});

// Router
app.use("/api/users", userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/suggestions', suggestionRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/cart_items', cartItemRoutes);
app.use('/api/customers', customerRoutes);

// Kết nối DB và khởi chạy server
app.listen(PORT, () => {
  console.log("Kết nối MySQL thành công!");
  console.log(`Server running on http://localhost:${PORT}`);
});