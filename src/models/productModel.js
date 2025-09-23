

// module.exports = ProductModel;

const { connectDB } = require("../configs/db");
const Product = require("./product");

const ProductModel = {
  // Lấy sản phẩm theo tên
  getByName: async (name) => {
    const connection = await connectDB();
    const [rows] = await connection.execute(
      "SELECT * FROM Products WHERE ProductName LIKE ?",
      [`%${name}%`]
    );
    return rows.map(row => new Product(row));
  },

  // Lấy sản phẩm theo category
  getByCategory: async (categoryId) => {
    const connection = await connectDB();
    const [rows] = await connection.execute(
      "SELECT * FROM Products WHERE CategoryID = ?",
      [categoryId]
    );
    return rows.map(row => new Product(row));
  },

  // Lấy sản phẩm theo ID
  getById: async (id) => {
    const connection = await connectDB();
    const [rows] = await connection.execute(
      "SELECT * FROM Products WHERE ProductID = ?",
      [id]
    );
    return rows.length > 0 ? rows.map(row => new Product(row)) : null;
  },

  // Lấy sản phẩm theo status
  getByStatus: async (status) => {
    const connection = await connectDB();
    const [rows] = await connection.execute(
      "SELECT * FROM Products WHERE status_Product = ?",
      [status]
    );
    return rows.map(row => new Product(row));
  },

  // Tạo sản phẩm mới
  create: async (product) => {
    const { ProductName, Price, Description, CategoryID, StockQuantity, SoldQuanlity, ImagePath, status_Product } = product;
    const connection = await connectDB();
    await connection.execute(
      `INSERT INTO Products 
      (ProductName, Price, Description, CategoryID, StockQuantity, SoldQuanlity, ImagePath, status_Product, CreatedAt, UpdatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [ProductName, Price, Description, CategoryID, StockQuantity, SoldQuanlity, ImagePath, status_Product]
    );
  },

  // Cập nhật sản phẩm
  updateProduct: async (id, product) => {
    const connection = await connectDB();
    const fields = [];
    const values = [];

    for (const key in product) {
      fields.push(`${key} = ?`);
      values.push(product[key]);
    }

    if (fields.length === 0) {
      throw new Error("Không có dữ liệu để cập nhật");
    }

    // Thêm cập nhật thời gian
    fields.push("UpdatedAt = CURRENT_TIMESTAMP");

    const sql = `UPDATE Products SET ${fields.join(", ")} WHERE ProductID = ?`;
    values.push(id);

    await connection.execute(sql, values);
  },

  // Xóa sản phẩm
  delete: async (id) => {
    const connection = await connectDB();
    await connection.execute(
      "DELETE FROM Products WHERE ProductID = ?",
      [id]
    );
  }
};

module.exports = ProductModel;
