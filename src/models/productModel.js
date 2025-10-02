

// module.exports = ProductModel;

const Product = require('./product');
const pool = require("../configs/db");

const ProductModel = {
  // Lấy sản phẩm theo tên
  getAllSortedBySoldQuantity: async () => {
  const [rows] = await pool.execute(
    "CALL GetAllProductsSortedBySoldQuantity()"
  );
  return rows[0].map(row => new Product(row));
},
  getByName: async (name) => {
    console.log('Đang tìm kiếm sản phẩm với tên:', name);
  const [rows] = await pool.execute(
    "CALL GetProductsByName(?)",
    [name]
  );
  console.log('Kết quả truy vấn:', rows);
  // Khi dùng CALL, kết quả trả về là mảng 2 chiều: [ [rows], ... ]
  return rows[0].map(row => new Product(row));
  },

  getByCategory: async (categoryId) => {
  const [rows] = await pool.execute(
    "CALL GetProductsByCategory(?)",
    [categoryId]
  );
  return rows[0].map(row => new Product(row));
  },

  getById: async (id) => {
  const [rows] = await pool.execute(
    "CALL GetProductByID(?)",
    [id]
  );
  return rows[0].length > 0 ? rows[0].map(row => new Product(row)) : null;
  },

  getByStatus: async (status) => {
  const [rows] = await pool.execute(
    "CALL GetProductsByStatus(?)",
    [status]
  );
  return rows[0].map(row => new Product(row));
  },

  // Tạo sản phẩm mới
  create: async (product) => {
    const { ProductName, Price, Description, CategoryID, StockQuantity, SoldQuanlity, ImagePath, status_Product } = product;
    
    await pool.execute(
      `INSERT INTO Products 
      (ProductName, Price, Description, CategoryID, StockQuantity, SoldQuanlity, ImagePath, status_Product, CreatedAt, UpdatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [ProductName, Price, Description, CategoryID, StockQuantity, SoldQuanlity, ImagePath, status_Product]
    );
  },

  // Cập nhật sản phẩm
  updateProduct: async (id, product) => {
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

    await pool.execute(sql, values);
  },

  // Xóa sản phẩm
  delete: async (id) => {
    await pool.execute(
      "DELETE FROM Products WHERE ProductID = ?",
      [id]
    );
  },
  
};

module.exports = ProductModel;
