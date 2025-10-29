const CartItemModel = require('../models/cartitemModel');

const CartItemController = {
  // POST /api/cart-items
  addCartItem: async (req, res) => {
    try {
      const { CartID, ProductID, Quantity = 1, Price } = req.body;
      if (!CartID || !ProductID || Price == null) {
        return res.status(400).json({ error: 'CartID, ProductID và Price là bắt buộc' });
      }
      const insertId = await CartItemModel.addOrUpdateCartItem({ CartID, ProductID, Quantity, Price });
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
    const { Quantity, is_selected } = req.body;

    if (
      !cartItemId ||
      (typeof Quantity === 'undefined' && typeof is_selected === 'undefined')
    ) {
      return res
        .status(400)
        .json({
          error:
            'cartItemId và ít nhất một trong Quantity hoặc is_selected là bắt buộc',
        });
    }

    const q =
      typeof Quantity !== 'undefined' ? Number(Quantity) : undefined;

    if (typeof q !== 'undefined' && (!Number.isInteger(q) || q < 1)) {
      return res
        .status(400)
        .json({ error: 'Quantity phải là số nguyên >= 1' });
    }

    const result = await CartItemModel.updateCartItem(
      cartItemId,
      q ?? null,
      is_selected ?? 0
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: 'CartItem không tìm thấy hoặc không thay đổi' });
    }

    return res.json({
      message: 'Cập nhật cart item thành công',
      CartItemID: result.CartItemID,
      affectedRows: result.affectedRows,
    });
  } catch (err) {
    console.error('updateCartItem error:', err);
    return res
      .status(500)
      .json({ error: 'Lỗi khi cập nhật cart item' });
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
  }
};

module.exports = CartItemController;

