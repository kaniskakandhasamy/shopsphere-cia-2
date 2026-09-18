const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Helper to get or create cart
const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
};

// @desc    Get user cart
// @route   GET /api/cart
const getCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name price discountPrice brand image stock'
    });

    res.json({
      success: true,
      cart: populatedCart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching cart'
    });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid quantity is required'
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const cart = await getOrCreateCart(req.user._id);
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    let targetQuantity = qty;
    if (itemIndex > -1) {
      targetQuantity = cart.items[itemIndex].quantity + qty;
    }

    // Check stock
    if (targetQuantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available in stock`
      });
    }

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = targetQuantity;
    } else {
      cart.items.push({ product: productId, quantity: qty });
    }

    cart.updatedAt = Date.now();
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name price discountPrice brand image stock'
    });

    res.json({
      success: true,
      message: 'Item added to cart',
      cart: populatedCart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error adding to cart'
    });
  }
};

// @desc    Update item quantity in cart
// @route   PUT /api/cart/:productId
const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (qty > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available in stock`
      });
    }

    const cart = await getOrCreateCart(req.user._id);
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not in cart'
      });
    }

    cart.items[itemIndex].quantity = qty;
    cart.updatedAt = Date.now();
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name price discountPrice brand image stock'
    });

    res.json({
      success: true,
      message: 'Cart updated',
      cart: populatedCart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error updating cart item'
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await getOrCreateCart(req.user._id);

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    cart.updatedAt = Date.now();
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name price discountPrice brand image stock'
    });

    res.json({
      success: true,
      message: 'Item removed from cart',
      cart: populatedCart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error removing item'
    });
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
const clearCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    cart.items = [];
    cart.updatedAt = Date.now();
    await cart.save();

    res.json({
      success: true,
      message: 'Cart cleared successfully',
      cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error clearing cart'
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart
};
