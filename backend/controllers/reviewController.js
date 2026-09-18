const Review = require('../models/Review');
const Product = require('../models/Product');

// Recalculate average rating and review count
const updateProductAverageRating = async (productId) => {
  const reviews = await Review.find({ product: productId });
  const numReviews = reviews.length;
  const rating =
    numReviews > 0
      ? Number((reviews.reduce((acc, item) => acc + item.rating, 0) / numReviews).toFixed(1))
      : 0;

  await Product.findByIdAndUpdate(productId, { rating, numReviews });
};

// @desc    Get reviews for a product
// @route   GET /api/products/:productId/reviews
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product: productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching reviews'
    });
  }
};

// @desc    Add review for a product
// @route   POST /api/products/:productId/reviews
const addReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide rating (1-5) and comment'
      });
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user already reviewed this product
    const alreadyReviewed = await Review.findOne({
      user: req.user._id,
      product: productId
    });

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product. Please update your existing review.'
      });
    }

    const review = await Review.create({
      user: req.user._id,
      product: productId,
      rating: numRating,
      comment: comment.trim()
    });

    await updateProductAverageRating(productId);

    const populatedReview = await Review.findById(review._id).populate('user', 'name');

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      review: populatedReview
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error adding review'
    });
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Verify user ownership
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to edit this review'
      });
    }

    if (rating !== undefined) {
      const numRating = Number(rating);
      if (isNaN(numRating) || numRating < 1 || numRating > 5) {
        return res.status(400).json({
          success: false,
          message: 'Rating must be between 1 and 5'
        });
      }
      review.rating = numRating;
    }

    if (comment !== undefined) {
      review.comment = comment.trim();
    }

    await review.save();
    await updateProductAverageRating(review.product);

    const populatedReview = await Review.findById(review._id).populate('user', 'name');

    res.json({
      success: true,
      message: 'Review updated successfully',
      review: populatedReview
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error updating review'
    });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Verify ownership or Admin
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    const productId = review.product;
    await Review.findByIdAndDelete(req.params.id);
    await updateProductAverageRating(productId);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error deleting review'
    });
  }
};

module.exports = {
  getProductReviews,
  addReview,
  updateReview,
  deleteReview
};
