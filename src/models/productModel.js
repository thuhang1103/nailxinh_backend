

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
  const [rows] = await pool.execute(
    "CALL GetProductsByName(?)",
    [name]
  );
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
    const { ProductName, Price, Description, CategoryID, StockQuantity, SoldQuantity, ImagePath, status_Product } = product;
    
    await pool.execute('CALL CreateProduct(?, ?, ?, ?, ?, ?, ?, ?)', [
  ProductName,
  Price,
  Description,
  CategoryID,
  StockQuantity,
  SoldQuantity,
  ImagePath,
  status_Product
]);
  },

  // Cập nhật sản phẩm
  updateProduct: async (id, product) => {
     const {
      ProductName,
      Price,
      Description,
      CategoryID,
      StockQuantity,
      SoldQuantity,
      ImagePath,
      status_Product
    } = product;

    // Gọi store UpdateProduct trong MySQL
    await pool.execute(
      'CALL UpdateProduct(?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        id,                  // pProductID
        ProductName ?? null,  // pProductName
        Price ?? null,        // pPrice
        Description ?? null,  // pDescription
        CategoryID ?? null,   // pCategoryID
        StockQuantity ?? null,// pStockQuantity
        SoldQuantity ?? null, // pSoldQuantity
        ImagePath ?? null,    // pImagePath
        status_Product ?? null // pStatus
      ]
    );
  },

  // Xóa sản phẩm
delete: async (id) => {
  await pool.execute(
    'CALL SoftDeleteProduct(?)',
    [id]
  );
},
  
};

module.exports = ProductModel;
