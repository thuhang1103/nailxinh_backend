const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { authenticateJWT, authorizeRoles } = require('../middlewares/authMiddleware');
const bcrypt = require('bcrypt');

router.post('/login', AuthController.login);
router.post('/logout', authenticateJWT, AuthController.logout);
router.post('/sendOTP', AuthController.sendOtp);
router.post('/verifyOTP', AuthController.verifyOtp);
router.post('/registerCustomer', AuthController.registerCustomer);
router.post('/registerStaff', authenticateJWT, authorizeRoles('Admin'), AuthController.registerStaff);
router.post('/refreshToken', AuthController.refreshToken);
router.get('/checkToken', authenticateJWT, AuthController.checkToken);
router.get('/role', authenticateJWT, (req, res) => {
  console.log('role được gọi bởi user:', req.user.UserID, 'role:', req.user.Role);
  res.json({ role: req.user.Role });
});
module.exports = router;