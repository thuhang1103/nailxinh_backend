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
//getImagesByProductId:
router.get('/images/:productId',authenticateJWT, authorizeRoles(['Admin']), ProductController.getImagesByProductId);

router.post('/images', authenticateJWT, authorizeRoles(['Admin']), ProductController.addProductImage);

router.delete('/images/:imageId', authenticateJWT, authorizeRoles(['Admin']), ProductController.deleteProductImage);
// Variant Options and Values
router.get('/variant-options/:productId', authenticateJWT, authorizeRoles(['Admin']), ProductController.getVariantOptionsByProductID);
router.post('/variant-options', authenticateJWT, authorizeRoles(['Admin']), ProductController.addVariantOption);
router.delete('/variant-options/:optionId', authenticateJWT, authorizeRoles(['Admin']), ProductController.deleteVariantOption);
router.put('/variant-options/', authenticateJWT, authorizeRoles(['Admin']), ProductController.updateVariantOptionName);
// Variant Values
router.post('/variant-values', authenticateJWT, authorizeRoles(['Admin']), ProductController.addVariantValue);
router.delete('/variant-values/:valueId', authenticateJWT, authorizeRoles(['Admin']), ProductController.deleteVariantValue);
router.put('/variant-values/', authenticateJWT, authorizeRoles(['Admin']), ProductController.updateVariantValueName);
router.get('/variant-values/:optionId', authenticateJWT, authorizeRoles(['Admin']), ProductController.getVariantValuesByOptionID);

module.exports = router;