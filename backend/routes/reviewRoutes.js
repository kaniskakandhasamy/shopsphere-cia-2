const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getProductReviews,
  addReview,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// Can be accessed via /api/reviews or nested /api/products/:productId/reviews
router.route('/')
  .get(getProductReviews)
  .post(protect, addReview);

router.route('/:id')
  .put(protect, updateReview)
  .delete(protect, deleteReview);

module.exports = router;
