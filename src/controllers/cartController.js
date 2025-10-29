const CartModel = require('../models/cartModel');

const CartController = {
  // POST /api/carts
  createCart: async (req, res) => {
    try {
      const { CustomerID } = req.body;
      if (!CustomerID || isNaN(Number(CustomerID))) {
        return res.status(400).json({ error: 'CustomerID không hợp lệ' });
      }
      const insertId = await CartModel.createCart(Number(CustomerID));
      return res.status(201).json({ message: 'Cart created', CartID: insertId });
    } catch (err) {
      console.error('createCart error:', err);
      return res.status(500).json({ error: 'Lỗi khi tạo giỏ hàng' });
    }
  },

  // DELETE /api/carts/:cartId
  deleteCart: async (req, res) => {
    try {
      const cartId = Number(req.params.cartId);
      if (!cartId) return res.status(400).json({ error: 'cartId không hợp lệ' });
      const affected = await CartModel.deleteCart(cartId);
      if (affected === 0) return res.status(404).json({ error: 'Cart không tìm thấy' });
      return res.json({ message: 'Xóa giỏ hàng thành công' });
    } catch (err) {
      console.error('deleteCart error:', err);
      return res.status(500).json({ error: 'Lỗi khi xóa giỏ hàng' });
    }
  }
};

module.exports = CartController;