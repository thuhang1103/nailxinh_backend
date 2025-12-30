const CartItemModel = require('../models/cartitemModel');

const CartItemController = {
  // POST /api/cart-items
  addCartItem: async (req, res) => {
    try {
      const { UserID, ProductID, VariantID, Quantity = 1, Price } = req.body;
      if (!UserID || !ProductID || Price == null) {
        return res.status(400).json({ error: 'UserID, ProductID và Price là bắt buộc' });
      }
      const insertId = await CartItemModel.addCartItem({ UserID, ProductID, VariantID, Quantity, Price });
      return res.status(201).json({ message: 'CartItem created', CartItemID: insertId });
    } catch (err) {
      console.error('addCartItem error:', err);
      return res.status(500).json({ error: 'Lỗi khi thêm cart item' });
    }
  },

  // PATCH /api/cart-items/:cartItemId
  updateCartItem: async (req, res) => {
  try {
    const cartItemId = Number(req.params.cartItemId);
    const { Quantity, is_selected, VariantID } = req.body;

    if (
      !cartItemId ||
      (typeof Quantity === 'undefined' &&
       typeof is_selected === 'undefined' &&
       typeof VariantID === 'undefined')
    ) {
      return res.status(400).json({
        error:
          'cartItemId và ít nhất một trong Quantity, is_selected hoặc VariantID là bắt buộc',
      });
    }


    const result = await CartItemModel.updateCartItem(
      cartItemId,
      Quantity ?? null,
      VariantID ?? null,
      is_selected ?? null
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'CartItem không tìm thấy hoặc không thay đổi' });
    }

    return res.json({
      message: 'Cập nhật cart item thành công',
      CartItemID: result.CartItemID,
      affectedRows: result.affectedRows,
    });
  } catch (err) {
    console.error('updateCartItem error:', err);
    return res.status(500).json({ error: 'Lỗi khi cập nhật cart item' });
  }
},
  // DELETE /api/cart-items/:cartItemId
  deleteCartItem: async (req, res) => {
    try {
      const cartItemId = Number(req.params.cartItemId);
      if (!cartItemId) return res.status(400).json({ error: 'cartItemId không hợp lệ' });
      const affected = await CartItemModel.deleteCartItem(cartItemId);
      if (affected === 0) return res.status(404).json({ error: 'CartItem không tìm thấy' });
      return res.json({ message: 'Xóa cart item thành công' });
    } catch (err) {
      console.error('deleteCartItem error:', err);
      return res.status(500).json({ error: 'Lỗi khi xóa cart item' });
    }
  },

  // GET /api/cart-items/:cartItemId
  getByCartItemId: async (req, res) => {
    try {
      const cartItemId = Number(req.params.cartItemId);
      if (!cartItemId) return res.status(400).json({ error: 'cartItemId không hợp lệ' });
      const item = await CartItemModel.getByCartItemId(cartItemId);
      if (!item) return res.status(404).json({ error: 'CartItem không tìm thấy' });
      return res.json(item);
    } catch (err) {
      console.error('getByCartItemId error:', err);
      return res.status(500).json({ error: 'Lỗi khi lấy cart item' });
    }
  },

  // GET /api/users/:userId/cart-items
  getAllByUserId: async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      if (!userId) return res.status(400).json({ error: 'userId không hợp lệ' });
      const items = await CartItemModel.getAllCartItemByUserId(userId);
      return res.json(items);
    } catch (err) {
      console.error('getAllByUserId error:', err);
      return res.status(500).json({ error: 'Lỗi khi lấy cart items của user' });
    }
  },
  //checkCartItemExits
  checkCartItemExists: async (req, res) => {
    try {
      const { userId, variantId, addQuantity } = req.body;
      if (!userId || !variantId || !addQuantity) {
        return res.status(400).json({ error: 'userId, variantId và addQuantity là bắt buộc' });
      }
      const existsItem = await CartItemModel.checkCartItemExists(userId, variantId, addQuantity);
      return res.json({ existsItem });
    } catch (err) {
      console.error('checkCartItemExists error:', err);
      return res.status(500).json({ error: 'Lỗi khi kiểm tra cart item' });
    }
  },
};

module.exports = CartItemController;

