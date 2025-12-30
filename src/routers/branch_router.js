const express = require('express');
const router = express.Router();
const branchController = require('../controllers/branch_controller');
const bcrypt = require('bcrypt');

router.get('/contacts', branchController.getBranchContacts);
router.get('/average-rating', branchController.getAverageRating);
router.get('/reviews', branchController.getAllBranchReviews);

module.exports = router;