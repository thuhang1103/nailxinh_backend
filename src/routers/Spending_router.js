const express = require('express');
const router = express.Router();
const SpendingController = require('../controllers/Spending_controller');
const { authenticateJWT, authorizeRoles } = require('../middlewares/authMiddleware');

router.get('/current-month', authenticateJWT, authorizeRoles('Customer'), SpendingController.getCurrentMonthSpending);
router.get('/monthly', authenticateJWT, authorizeRoles('Customer'), SpendingController.getMonthlySpendingCurrentYear);
router.get('/completed-orders/count', authenticateJWT, authorizeRoles('Customer'), SpendingController.countCompletedOrdersCurrentMonth);
router.get('/total-amount', authenticateJWT, authorizeRoles('Customer'), SpendingController.sumCurrentYear);
router.get('/completed-orders/count/year', authenticateJWT, authorizeRoles('Customer'), SpendingController.countCompletedOrdersCurrentYear);

module.exports = router;
