const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Get admin dashboard metrics & stats
// @route   GET /api/admin/dashboard
const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Calculate total revenue from non-cancelled orders
    const revenueResult = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'CANCELLED' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // Recent orders (last 5)
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Low stock products (stock < 10 per Section 38)
    const lowStockProducts = await Product.find({ stock: { $lt: 10 } })
      .populate('category', 'name')
      .sort({ stock: 1 })
      .limit(10);

    // Sales by status breakdown for chart
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 }, revenue: { $sum: '$totalAmount' } } }
    ]);

    // Monthly / Recent daily sales trend
    const recentDailySales = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'CANCELLED' } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          totalSales: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } },
      { $limit: 7 }
    ]);

    res.json({
      success: true,
      stats: {
        totalProducts,
        totalUsers,
        totalOrders,
        totalRevenue,
        recentOrders,
        lowStockProducts,
        ordersByStatus,
        recentDailySales: recentDailySales.reverse()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error loading dashboard'
    });
  }
};

// @desc    Get all registered users (No passwords)
// @route   GET /api/admin/users
const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching users'
    });
  }
};

// @desc    Get all orders for admin
// @route   GET /api/admin/orders
const getAdminOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email phone')
      .populate('products.product', 'name brand image')
      .sort({ createdAt: -1 });

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

// @desc    Update order status
// @route   PUT /api/admin/orders/:id
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['PLACED', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed statuses: ${allowedStatuses.join(', ')}`
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const prevStatus = order.orderStatus;
    order.orderStatus = status;
    await order.save();

    // If order was transitioned into CANCELLED, restore product stock
    if (status === 'CANCELLED' && prevStatus !== 'CANCELLED') {
      for (const item of order.products) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity }
        });
      }
    }

    // If order was CANCELLED and is being reinstated, re-decrement stock if possible
    if (prevStatus === 'CANCELLED' && status !== 'CANCELLED') {
      for (const item of order.products) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity }
        });
      }
    }

    const updatedOrder = await Order.findById(order._id)
      .populate('user', 'name email phone')
      .populate('products.product', 'name brand image');

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      order: updatedOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error updating order status'
    });
  }
};

module.exports = {
  getDashboardStats,
  getUsers,
  getAdminOrders,
  updateOrderStatus
};
