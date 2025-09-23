
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bcrypt = require('bcrypt');
const { connectDB } = require("./src/configs/db");
const userRoutes = require("./src/routers/users");
const authRoutes = require("./src/routers/authroutes");
const productRoutes = require("./src/routers/products");
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

// Kết nối DB và khởi chạy server
connectDB()
  .then(() => {
    console.log("Kết nối SQL Server thành công!");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error("Lỗi kết nối DB:", err));