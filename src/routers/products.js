const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const { authenticateJWT, authorizeRoles } = require('../middlewares/authMiddleware');

router.get('/search', ProductController.getByName); // ?name=abc
router.get('/category/:categoryId', ProductController.getByCategory);
router.get('/:id', ProductController.getById); // /products/5
router.get('/status/:status', ProductController.getByStatus); // /products/status/1
router.post('/', authenticateJWT, authorizeRoles(['Admin']), ProductController.create);
router.put('/:id', authenticateJWT, authorizeRoles(['Admin']), ProductController.update);
router.delete('/:id', authenticateJWT, authorizeRoles(['Admin']), ProductController.delete);
module.exports = router;