const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const { authenticateJWT, authorizeRoles } = require('../middlewares/authMiddleware');

router.get('/searchName', ProductController.getByName); 
router.get('/all', ProductController.getAllSortedBySoldQuantity);
router.get('/category/:categoryId', ProductController.getByCategory);
router.get('/id/:id', ProductController.getById); // /products/5
router.get('/status/:status', ProductController.getByStatus); // /products/status/1
router.post('/create', authenticateJWT, authorizeRoles(['Admin']), ProductController.create);
router.put('/update/:id', authenticateJWT, authorizeRoles(['Admin']), ProductController.update);
router.delete('/delete/:id', authenticateJWT, authorizeRoles(['Admin']), ProductController.delete);
module.exports = router;