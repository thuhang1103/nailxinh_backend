
const Product = require('./product');
const ProductDetail = require('./product_detail');
const image= require('./product_image');
const variantOption = require('./Variant_Options');
const variantValue = require('./variant_value');

const pool = require("../configs/db");
function extractInsertId(rows) {
  if (!rows) return 0;

  if (Array.isArray(rows)) {
    if (Array.isArray(rows[0]) && rows[0].length > 0 && rows[0][0].insertId) {
      return rows[0][0].insertId;
    }
    if (rows[0] && rows[0].insertId) {
      return rows[0].insertId;
    }
  }

  if (rows.insertId) return rows.insertId;
  return 0;
}
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
   const [rows] = await pool.execute("CALL GetProductByID(?)", [id]);

  if (!rows[0] || rows[0].length === 0) return null;

  return rows[0].map(row => {
    if (row.Images && typeof row.Images === 'string') {
      row.Images = row.Images.split(',').map(url => url.trim());
    } else {
      row.Images = [];
    }

    return new ProductDetail(row);
  });
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
  getImagesByProductId: async (productId) => {
    const [rows] = await pool.execute("CALL GetImagesByProductID(?)", [productId]);
    const data = Array.isArray(rows) ? rows[0] ?? [] : rows ?? [];
    return (data || []).map(r => new image(r));
  },

  // Thêm image cho product -> trả về insertId (hoặc 0 nếu không lấy được)
  addProductImage: async (productId, imageURL) => {
    const [rows] = await pool.query("CALL AddProductImage(?, ?)", [productId, imageURL]);
    const insertId = extractInsertId(rows);
    return insertId ?? 0;
  },

  // Xóa image theo imageId -> trả về affectedRows
  deleteProductImage: async (imageId) => {
    const [rows] = await pool.execute("CALL DeleteProductImage(?)", [imageId]);
    const resultHeader = Array.isArray(rows) && rows.length > 1 ? rows[1] : rows;
    return resultHeader?.affectedRows ?? 0;
  },
  // GetVariantOptionsByProductID
  getVariantOptionsByProductID: async (productId) => {
    const [rows] = await pool.execute("CALL GetVariantOptionsByProductID(?)", [productId]);
    return rows[0].map(row => new variantOption(row));
  },
  //AddVariantOption
  addVariantOption: async (productId, optionName) => {
    const [rows] = await pool.execute("CALL AddVariantOption(?, ?)", [productId, optionName]);
    const insertId = extractInsertId(rows);
    return insertId ?? 0;
  },
  deleteVariantOption: async (optionId) => {
    const [rows] = await pool.execute("CALL DeleteVariantOption(?)", [optionId]);
    const resultHeader = Array.isArray(rows) && rows.length > 1 ? rows[1] : rows;
    return resultHeader?.affectedRows ?? 0;
  },

  // Cập nhật tên option -> trả về affectedRows
  updateVariantOptionName: async (optionId, newName) => {
    const [rows] = await pool.execute("CALL UpdateVariantOptionName(?, ?)", [optionId, newName]);
    const resultHeader = Array.isArray(rows) && rows.length > 1 ? rows[1] : rows;
    return resultHeader?.affectedRows ?? 0;
  },
  //AddVariantValue
  addVariantValue: async (optionId, valueName) => {
    const [rows] = await pool.execute("CALL AddVariantValue(?, ?)", [optionId, valueName]);
    const insertId = extractInsertId(rows);
    return insertId ?? 0;
  },
  //DeleteVariantValue
  deleteVariantValue: async (valueId) => {
    const [rows] = await pool.execute("CALL DeleteVariantValue(?)", [valueId]);
    if (Array.isArray(rows) && Array.isArray(rows[0]) && typeof rows[0][0]?.affectedRows !== 'undefined') {
      return rows[0][0].affectedRows;
    }
    return 0;
  },
  //UpdateVariantValueName
  updateVariantValueName: async (valueId, newName) => {
     const [rows] = await pool.execute("CALL UpdateVariantValueName(?, ?)", [valueId, newName]);

    if (Array.isArray(rows) && Array.isArray(rows[0]) && rows[0][0]?.affectedRows !== undefined) {
    return rows[0][0].affectedRows;
    }
    return 0;
  },
  //GetVariantValuesByOptionID
  getVariantValuesByOptionID: async (optionId) => {
    const [rows] = await pool.execute("CALL GetVariantValuesByOptionID(?)", [optionId]);
    return rows[0].map(row => new variantValue(row));
  },
  insertProductVariant: async (
    productId,
    option1ValueId,
    option2ValueId = null,
    price = 0,
    stock = 0,
    imageURL = null
  ) => {
    const pProductID = Number(productId);
    const pOption1 = Number(option1ValueId);
    const pOption2 = option2ValueId != null ? Number(option2ValueId) : null;
    const pPrice = price != null ? Number(price) : 0;
    const pStock = stock != null ? Number(stock) : 0;
    const pImage = imageURL ?? null;

    const [rows] = await pool.execute(
      "CALL InsertProductVariant(?, ?, ?, ?, ?, ?)",
      [pProductID, pOption1, pOption2, pPrice, pStock, pImage]
    );

    return extractInsertId(rows);
  },
  getVariantsByValueIds: async (valueId1, valueId2 = null) => {
  const [rows] = await pool.execute("CALL GetVariantsByValueIDs(?, ?)", [valueId1, valueId2]);
  return rows[0];
  },
    getVariantIDByOptions: async (option1ValueId, option2ValueId = null) => {
    const [rows] = await pool.execute("CALL GetVariantIDByOptions(?, ?)", [option1ValueId, option2ValueId]);
    const resultSet = Array.isArray(rows) ? (rows[0] ?? []) : (rows ?? []);
    return resultSet[0]?.VariantID ?? null;
  },
  getSimilarProductsByKeywords: async (keywords) => {
    if (!keywords) return [];

    let payload;
    if (typeof keywords === 'string') {
      try {
        JSON.parse(keywords);
        payload = keywords;
      } catch {
        payload = JSON.stringify([keywords]);
      }
    } else if (Array.isArray(keywords)) {
      payload = JSON.stringify(keywords);
    } else {
      return [];
    }

    const [rows] = await pool.execute("CALL GetSimilarProductsByKeywordList(?)", [payload]);
    const list = Array.isArray(rows) ? (rows[0] ?? []) : (rows ?? []);
    return list.map(r => new Product(r));
  },
}
module.exports = ProductModel;
