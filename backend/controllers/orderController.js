const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

// @desc    Create new Cash on Delivery order
// @route   POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { shippingAddress, items } = req.body;

    // Validate shipping address
    if (
      !shippingAddress ||
      !shippingAddress.name ||
      !shippingAddress.phone ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.pincode
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide complete shipping address'
      });
    }

    // Determine order items (either passed in body or pulled from Cart)
    let orderItems = [];
    if (items && Array.isArray(items) && items.length > 0) {
      orderItems = items;
    } else {
      const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Your cart is empty'
        });
      }
      orderItems = cart.items.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        image: item.product.image,
        price: item.product.discountPrice > 0 ? item.product.discountPrice : item.product.price,
        quantity: item.quantity
      }));
    }

    if (orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No items to order'
      });
    }

    // Validate stock and compute total
    let totalAmount = 0;
    const finalProducts = [];

    for (const item of orderItems) {
      const productId = item.product._id || item.product;
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.name || productId} not found`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Available: ${product.stock}, requested: ${item.quantity}`
        });
      }

      const unitPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
      totalAmount += unitPrice * item.quantity;

      finalProducts.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: unitPrice,
        quantity: item.quantity
      });
    }

    // Create Order - Strictly COD
    const order = await Order.create({
      user: req.user._id,
      products: finalProducts,
      shippingAddress: {
        name: shippingAddress.name.trim(),
        phone: shippingAddress.phone.trim(),
        address: shippingAddress.address.trim(),
        city: shippingAddress.city.trim(),
        state: shippingAddress.state.trim(),
        pincode: shippingAddress.pincode.trim()
      },
      totalAmount,
      paymentMethod: 'COD',
      orderStatus: 'PLACED'
    });

    // Reduce stock for each product
    for (const item of finalProducts) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    // Clear cart
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $set: { items: [], updatedAt: Date.now() } }
    );

    res.status(201).json({
      success: true,
      message: 'Order placed successfully with Cash on Delivery',
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error creating order'
    });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching orders'
    });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('products.product', 'name brand image');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check authorization: customer can only view their own order; admin can view all
    if (
      req.user.role !== 'ADMIN' &&
      order.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching order'
    });
  }
};

// @desc    Cancel order (Customer can only cancel if PLACED)
// @route   PUT /api/orders/:id/cancel
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Verify ownership
    if (
      req.user.role !== 'ADMIN' &&
      order.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    // Per Section 15: Customer can cancel an order when its status is PLACED
    if (order.orderStatus !== 'PLACED') {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled because it is already ${order.orderStatus}`
      });
    }

    order.orderStatus = 'CANCELLED';
    await order.save();

    // Restore stock
    for (const item of order.products) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity }
      });
    }

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error cancelling order'
    });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder
};
