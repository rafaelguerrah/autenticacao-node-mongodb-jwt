const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const checkToken = require('../middlewares/authMiddleware');

router.get('/me', checkToken, userController.getCurrentUser);
router.get('/:id', checkToken, userController.getUser);
router.patch('/:id', checkToken, userController.updateUser);
router.delete('/:id', checkToken, userController.deleteUser);

module.exports = router