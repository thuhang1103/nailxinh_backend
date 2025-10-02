

const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const { authenticateJWT, authorizeRoles } = require('../middlewares/authMiddleware');

// GET /api/users
router.get("/", UserController.getAllUsers);
router.post('/', UserController.create);
router.put('/:id', UserController.update);
router.delete('/:id', UserController.delete);
router.post('/checkUsername', UserController.checkUsername);
router.post('/checkEmail', UserController.checkEmail);

module.exports = router;