const express = require('express');
const router = express.Router();
const CustomerController = require('../controllers/customerController');
const { authenticateJWT, authorizeRoles } = require('../middlewares/authMiddleware');


// Public
router.get('/user/:userId', CustomerController.getCustomerByUserId);
router.get('/id/:userId', CustomerController.getCustomerIdByUserId);

// Protected
router.post('/add', CustomerController.addCustomer);
router.patch('/update', authenticateJWT, authorizeRoles('Customer'), CustomerController.updateCustomer);

// Admin only for delete (adjust role as needed)
router.delete('/delete', authenticateJWT, authorizeRoles('Customer'), CustomerController.deleteCustomer);
//acount
router.get('/get_profile', authenticateJWT, authorizeRoles('Customer'), CustomerController.getCustomerProfile);
router.patch('/update_profile', authenticateJWT, authorizeRoles('Customer'), CustomerController.updateCustomerProfile);
router.delete('/delete_account', authenticateJWT, authorizeRoles('Customer'), CustomerController.deleteAccount);

module.exports = router;