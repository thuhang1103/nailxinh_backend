const express = require('express');
const router = express.Router();
const AddressController = require('../controllers/address_controller');
const { authenticateJWT, authorizeRoles } = require('../middlewares/authMiddleware');

router.get('/default', authenticateJWT, authorizeRoles('Customer'), AddressController.getDefaultAddress);
router.post('/add', authenticateJWT, authorizeRoles('Customer'), AddressController.addShippingAddress);
router.get('/all', authenticateJWT, authorizeRoles('Customer'), AddressController.getShippingAddresses);
router.delete('/delete', authenticateJWT, authorizeRoles('Customer'), AddressController.deleteShippingAddress);
router.put('/update', authenticateJWT, authorizeRoles('Customer'), AddressController.updateShippingAddress);

module.exports = router;
