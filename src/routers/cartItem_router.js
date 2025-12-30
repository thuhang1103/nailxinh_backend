const express = require('express');
const router = express.Router();
const CartItemController = require('../controllers/cartItemController');
const { authenticateJWT, authorizeRoles } = require('../middlewares/authMiddleware');

// Thêm cart item
router.post('/add', authenticateJWT, authorizeRoles('Customer'),CartItemController.addCartItem);

// Cập nhật cart item (số lượng / is_selected)
router.patch('/update/:cartItemId', authenticateJWT, authorizeRoles('Customer'), CartItemController.updateCartItem);

// Xóa cart item
router.delete('/delete/:cartItemId', authenticateJWT, authorizeRoles('Customer'), CartItemController.deleteCartItem);

// Lấy cart item theo id
router.get('/:cartItemId', authenticateJWT, authorizeRoles('Customer'), CartItemController.getByCartItemId);

// Lấy tất cả cart items của user
router.get('/user/:userId', authenticateJWT, authorizeRoles('Customer'), CartItemController.getAllByUserId);

// Kiểm tra cart item tồn tại
router.post('/check-exists', authenticateJWT, authorizeRoles('Customer'), CartItemController.checkCartItemExists);

module.exports = router;