const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Get all products with filtering, search, sorting & pagination
// @route   GET /api/products
const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12; // 12 per page per Section 20
    const skip = (page - 1) * limit;

    const query = {};

    // Search by name or brand (Section 17)
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { brand: searchRegex }
      ];
    }

    // Category filter (Section 18)
    if (req.query.category && req.query.category !== 'All') {
      // Support either Category ObjectId or Category Name
      if (req.query.category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = req.query.category;
      } else {
        const foundCat = await Category.findOne({
          name: new RegExp(`^${req.query.category.trim()}$`, 'i')
        });
        if (foundCat) {
          query.category = foundCat._id;
        }
      }
    }

    // Featured filter
    if (req.query.isFeatured !== undefined) {
      query.isFeatured = req.query.isFeatured === 'true';
    }

    // Sorting (Section 19: price_asc, price_desc, newest)
    let sortOption = { createdAt: -1 }; // default newest
    if (req.query.sort === 'price_asc') {
      sortOption = { price: 1 };
    } else if (req.query.sort === 'price_desc') {
      sortOption = { price: -1 };
    } else if (req.query.sort === 'newest') {
      sortOption = { createdAt: -1 };
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name')
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / limit) || 1,
      currentPage: page,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching products'
    });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching product'
    });
  }
};

// @desc    Create product
// @route   POST /api/products (Admin only)
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      brand,
      category,
      image,
      stock,
      isFeatured
    } = req.body;

    if (!name || !description || price === undefined || !brand || !category || !image) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required product fields'
      });
    }

    const product = await Product.create({
      name: name.trim(),
      description,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : 0,
      brand: brand.trim(),
      category,
      image,
      stock: stock !== undefined ? Number(stock) : 0,
      isFeatured: Boolean(isFeatured)
    });

    const populatedProduct = await Product.findById(product._id).populate('category', 'name');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: populatedProduct
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error creating product'
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id (Admin only)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const {
      name,
      description,
      price,
      discountPrice,
      brand,
      category,
      image,
      stock,
      isFeatured
    } = req.body;

    if (name) product.name = name.trim();
    if (description) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (discountPrice !== undefined) product.discountPrice = Number(discountPrice);
    if (brand) product.brand = brand.trim();
    if (category) product.category = category;
    if (image) product.image = image;
    if (stock !== undefined) product.stock = Number(stock);
    if (isFeatured !== undefined) product.isFeatured = Boolean(isFeatured);

    await product.save();

    const updatedProduct = await Product.findById(product._id).populate('category', 'name');

    res.json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error updating product'
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id (Admin only)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error deleting product'
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
