const express = require('express');
const router = express.Router();
const voucherController = require('../controllers/voucher_controller');
const { authenticateJWT, authorizeRoles } = require('../middlewares/authMiddleware');
const bcrypt = require('bcrypt');

router.get('/all', voucherController.getAllVouchers);
router.get('/max', voucherController.getMaxVoucher);
router.get('/available', voucherController.getAvailableVouchers);

module.exports = router;