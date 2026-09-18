const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getUsers,
  getAdminOrders,
  updateOrderStatus
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// All admin routes require authentication and admin role
router.use(protect, adminOnly);

router.get('/dashboard', getDashboardStats);
router.get('/users', getUsers);
router.get('/orders', getAdminOrders);
router.put('/orders/:id', updateOrderStatus);

module.exports = router;
