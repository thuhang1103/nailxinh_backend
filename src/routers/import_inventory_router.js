const express = require('express');
const router = express.Router();
const ImportInventoryController = require('../controllers/import_inventory_controller');
const { authenticateJWT, authorizeRoles } = require('../middlewares/authMiddleware');

router.post('/import', authenticateJWT, authorizeRoles('Admin'), ImportInventoryController.createImportInventory);

module.exports = router;
