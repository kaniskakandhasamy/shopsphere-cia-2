const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Get current user's wishlist
// @route   GET /api/wishlist
const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'wishlist',
      select: 'name price discountPrice brand image stock rating'
    });

    res.json({
      success: true,
      count: user.wishlist.length,
      wishlist: user.wishlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching wishlist'
    });
  }
};

// @desc    Add product to wishlist
// @route   POST /api/wishlist/:productId
const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const user = await User.findById(req.user._id);

    // Prevent duplicates (Section 12)
    const exists = user.wishlist.some(
      (id) => id.toString() === productId
    );

    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'Product already in wishlist'
      });
    }

    user.wishlist.push(productId);
    await user.save();

    const populatedUser = await User.findById(user._id).populate({
      path: 'wishlist',
      select: 'name price discountPrice brand image stock rating'
    });

    res.status(201).json({
      success: true,
      message: 'Product added to wishlist',
      wishlist: populatedUser.wishlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error adding to wishlist'
    });
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);

    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== productId
    );
    await user.save();

    const populatedUser = await User.findById(user._id).populate({
      path: 'wishlist',
      select: 'name price discountPrice brand image stock rating'
    });

    res.json({
      success: true,
      message: 'Product removed from wishlist',
      wishlist: populatedUser.wishlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error removing from wishlist'
    });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist
};
