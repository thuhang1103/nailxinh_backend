const mysql = require("mysql2/promise"); // mysql2 có hỗ trợ promise
require("dotenv").config();

// Cấu hình kết nối MySQL
const config = {
  host: process.env.DB_HOST,     // ví dụ: localhost
  user: process.env.DB_USER,     // ví dụ: nodeuser
  password: process.env.DB_PASS, // ví dụ: nodepass123
  database: process.env.DB_NAME, // ví dụ: nailxinhdb
  port: process.env.DB_PORT || 3306
};

// Hàm kết nối DB
async function connectDB() {
  try {
    const connection = await mysql.createConnection(config);
    console.log("Kết nối MySQL thành công!");
    return connection;
  } catch (err) {
    console.error("Lỗi kết nối MySQL:", err);
  }
}

module.exports = { connectDB, mysql };