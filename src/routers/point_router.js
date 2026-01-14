const express = require('express');
const router = express.Router();
const PointController = require('../controllers/pointController');
const { authenticateJWT, authorizeRoles } = require('../middlewares/authMiddleware');

router.get('/loyalty-points', authenticateJWT, authorizeRoles('Customer'), PointController.getLoyaltyPoints);
router.get('/membership-level', authenticateJWT, authorizeRoles('Customer'), PointController.getMembershipLevel);
router.post('/add-points', authenticateJWT, authorizeRoles('Customer'), PointController.addPointsDaily);
router.get('/points-status', authenticateJWT, authorizeRoles('Customer'), PointController.getPointsStatus);
router.get('/can-spin-today', authenticateJWT, authorizeRoles('Customer'), PointController.checkCanSpinToday);
router.post('/spin-lucky', authenticateJWT, authorizeRoles('Customer'), PointController.spinLucky);
router.post('/reset-points', authenticateJWT, authorizeRoles('Customer'), PointController.resetLoyaltyPoints);

module.exports = router;