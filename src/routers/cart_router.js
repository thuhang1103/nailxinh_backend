const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cartController');
const { authenticateJWT, authorizeRoles } = require('../middlewares/authMiddleware');

// Tạo giỏ hàng
router.post('/create',  CartController.createCart);

// Xóa giỏ hàng (customer hoặc điều chỉnh role tuỳ ý)
router.delete('/delete/:cartId', authenticateJWT, authorizeRoles('Admin'), CartController.deleteCart);

module.exports = router;