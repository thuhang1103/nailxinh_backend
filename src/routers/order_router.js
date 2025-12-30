const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/order_controller');
const { authenticateJWT, authorizeRoles } = require('../middlewares/authMiddleware');

router.post('/create', authenticateJWT, authorizeRoles('Customer'), OrderController.createOrder);
router.get('/my', authenticateJWT, authorizeRoles('Customer'), OrderController.getOrdersByUserAndStatus);
router.get('/get-all', authenticateJWT, authorizeRoles('Admin'), OrderController.getOrdersByStatus);
router.put('/update-order', authenticateJWT, authorizeRoles('Admin'), OrderController.updateOrderStatus);
router.post('/create-order-detail', authenticateJWT, authorizeRoles('Customer'), OrderController.createOrderDetail);
router.get('/order-details/:orderId',  OrderController.getOrderDetailsByOrderId);
//getrevenue
router.get('/revenue/today', authenticateJWT, authorizeRoles('Admin'), OrderController.getRevenueToday);
router.get('/revenue/current-month', authenticateJWT, authorizeRoles('Admin'), OrderController.getRevenueCurrentMonth);
router.get('/revenue/current-quarter', authenticateJWT, authorizeRoles('Admin'), OrderController.getRevenueCurrentQuarter);
router.get('/revenue/current-year', authenticateJWT, authorizeRoles('Admin'), OrderController.getRevenueCurrentYear);

module.exports = router;