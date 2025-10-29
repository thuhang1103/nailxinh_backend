const pool = require("../configs/db");
const CartItem = require("./cartItem");

const CartItemModel = {
  // Thêm cart item bằng stored procedure -> trả về insertId (hoặc 0)
  addCartItem: async ({ CartID, ProductID, Quantity = 1, Price }) => {
    const [rows] = await pool.execute(
      "CALL AddCartItem(?, ?, ?, ?)",
      [CartID, ProductID, Quantity, Price]
    );
     const insertId = rows[0][0]?.insertId ?? 0;
  return insertId;
  },

  // Cập nhật quantity và is_selected bằng stored procedure -> trả về affectedRows
  updateCartItem: async (CartItemID, Quantity, is_selected = 0) => {
    const [rows] = await pool.execute(
      "CALL UpdateCartItem(?, ?, ?)",
      [CartItemID, Quantity, is_selected]
    );
    const result = rows[0][0] ?? {};
    return {
    affectedRows: result.affectedRows ?? 0,
    CartItemID: result.CartItemID ?? null
    };
  },
  addOrUpdateCartItem: async ({ CartID, ProductID, Quantity = 1, Price }) => {
  const [existingRows] = await pool.execute(
    "SELECT CartItemID, Quantity FROM CartItem WHERE CartID = ? AND ProductID = ?",
    [CartID, ProductID]
  );
  console.log('existingRows:', existingRows.length); // Debug line

  if (existingRows.length > 0) {
    const CartItemID = existingRows[0].CartItemID;
    const newQuantity = existingRows[0].Quantity + Quantity;
    return await CartItemModel.updateCartItem(CartItemID, newQuantity);
  } else {
    // Nếu chưa tồn tại, insert mới
    return await CartItemModel.addCartItem({ CartID, ProductID, Quantity, Price });
  }
  }, 

  // Xóa cart item bằng stored procedure -> trả về affectedRows
  deleteCartItem: async (CartItemID) => {
    const [rows] = await pool.execute(
      "CALL DeleteCartItem(?)",
      [CartItemID]
    );
    const resultHeader = Array.isArray(rows) && rows.length > 1 ? rows[1] : rows;
    return resultHeader?.affectedRows ?? 0;
  },

  // Lấy tất cả cart items của user bằng stored procedure -> trả về mảng CartItem
  getAllCartItemByUserId: async (userId) => {
    const [rows] = await pool.execute(
      "CALL GetCartItemsByUserId(?)",
      [userId]
    );
    const data = Array.isArray(rows) ? rows[0] ?? [] : rows ?? [];
    return (data || []).map(r => new CartItem(r));
  },

  // Lấy CartItem theo CartItemID (SELECT trực tiếp) -> CartItem object hoặc null
  getByCartItemId: async (cartItemId) => {
    const [rows] = await pool.execute(
      "CALL GetCartItemById(?)",
      [cartItemId]
    );
     const resultSet = Array.isArray(rows) ? rows[0] ?? [] : rows ?? [];
    if (!resultSet || resultSet.length === 0) return null;
    return new CartItem(resultSet[0]);
  },

};

module.exports = CartItemModel;