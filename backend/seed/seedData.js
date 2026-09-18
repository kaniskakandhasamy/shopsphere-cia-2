const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Review = require('../models/Review');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/shopsphere';

// 10 Categories definition
const categoriesData = [
  {
    name: 'Electronics',
    description: 'Cutting-edge consumer tech, smart home devices, and audio accessories.',
    image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Mobile Phones',
    description: 'Latest flagship and budget smartphones with top-tier cameras and battery life.',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Laptops',
    description: 'High-performance laptops for productivity, programming, creative work, and gaming.',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Headphones',
    description: 'Wireless noise-canceling headphones, audiophile monitors, and true wireless earbuds.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Cameras',
    description: 'Professional mirrorless cameras, action cams, and creator equipment.',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: "Men's Clothing",
    description: 'Timeless menswear, casual daily wear, jackets, and premium essentials.',
    image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: "Women's Clothing",
    description: 'Contemporary fashion, dresses, outerwear, and activewear for women.',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Shoes',
    description: 'Athletic sneakers, running performance shoes, and durable boots.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Home & Kitchen',
    description: 'Modern kitchen appliances, cookware, espresso machines, and home gadgets.',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Books',
    description: 'Bestselling books on technology, productivity, personal finance, and psychology.',
    image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&auto=format&fit=crop&q=80'
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('[Seed] Connected to MongoDB');

    // Clear existing data for idempotency
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      Review.deleteMany({}),
      Order.deleteMany({}),
      Cart.deleteMany({})
    ]);

    // 1. Insert 10 Categories
    const createdCategories = await Category.insertMany(categoriesData);
    const catMap = {};
    createdCategories.forEach((cat) => {
      catMap[cat.name] = cat._id;
    });

    // 2. Insert 1 Admin and 10 Customers (11 Users total)
    const adminPassword = await bcrypt.hash('Admin@123', 10);
    const customerPassword = await bcrypt.hash('Customer@123', 10);

    const usersData = [
      {
        name: 'ShopSphere Administrator',
        email: 'admin@shopsphere.com',
        password: adminPassword,
        phone: '+1 555-0199',
        role: 'ADMIN',
        address: {
          addressLine: '100 Commerce Boulevard, Suite 500',
          city: 'San Jose',
          state: 'California',
          pincode: '95113'
        }
      },
      {
        name: 'Alex Johnson',
        email: 'alex.johnson@example.com',
        password: customerPassword,
        phone: '+1 555-0101',
        role: 'CUSTOMER',
        address: { addressLine: '142 Pine Street', city: 'Seattle', state: 'Washington', pincode: '98101' }
      },
      {
        name: 'Sarah Williams',
        email: 'sarah.w@example.com',
        password: customerPassword,
        phone: '+1 555-0102',
        role: 'CUSTOMER',
        address: { addressLine: '784 Oak Avenue', city: 'Austin', state: 'Texas', pincode: '73301' }
      },
      {
        name: 'David Miller',
        email: 'david.miller@example.com',
        password: customerPassword,
        phone: '+1 555-0103',
        role: 'CUSTOMER',
        address: { addressLine: '320 Elm Drive', city: 'Denver', state: 'Colorado', pincode: '80202' }
      },
      {
        name: 'Emily Davis',
        email: 'emily.davis@example.com',
        password: customerPassword,
        phone: '+1 555-0104',
        role: 'CUSTOMER',
        address: { addressLine: '55 Maple Court', city: 'Chicago', state: 'Illinois', pincode: '60601' }
      },
      {
        name: 'Michael Brown',
        email: 'michael.b@example.com',
        password: customerPassword,
        phone: '+1 555-0105',
        role: 'CUSTOMER',
        address: { addressLine: '910 Cedar Lane', city: 'Boston', state: 'Massachusetts', pincode: '02108' }
      },
      {
        name: 'Jessica Taylor',
        email: 'jessica.t@example.com',
        password: customerPassword,
        phone: '+1 555-0106',
        role: 'CUSTOMER',
        address: { addressLine: '423 Birch Way', city: 'Portland', state: 'Oregon', pincode: '97201' }
      },
      {
        name: 'James Anderson',
        email: 'james.a@example.com',
        password: customerPassword,
        phone: '+1 555-0107',
        role: 'CUSTOMER',
        address: { addressLine: '612 Spruce Street', city: 'Atlanta', state: 'Georgia', pincode: '30303' }
      },
      {
        name: 'Olivia Martinez',
        email: 'olivia.m@example.com',
        password: customerPassword,
        phone: '+1 555-0108',
        role: 'CUSTOMER',
        address: { addressLine: '235 Walnut Circle', city: 'San Diego', state: 'California', pincode: '92101' }
      },
      {
        name: 'Daniel White',
        email: 'daniel.w@example.com',
        password: customerPassword,
        phone: '+1 555-0109',
        role: 'CUSTOMER',
        address: { addressLine: '879 Aspen Boulevard', city: 'Miami', state: 'Florida', pincode: '33101' }
      },
      {
        name: 'Sophia Clark',
        email: 'sophia.c@example.com',
        password: customerPassword,
        phone: '+1 555-0110',
        role: 'CUSTOMER',
        address: { addressLine: '164 Chestnut Avenue', city: 'Phoenix', state: 'Arizona', pincode: '85001' }
      }
    ];

    const createdUsers = await User.insertMany(usersData);
    const customers = createdUsers.filter((u) => u.role === 'CUSTOMER');

    // 3. 100 Realistic Products across 10 categories (10 items per category)
    const rawProducts = [
      // Category 1: Electronics (10 items)
      {
        name: 'Samsung 55" Crystal 4K UHD Smart TV',
        description: 'Vibrant PurColor display with Crystal Processor 4K, HDR10+, and built-in voice assistants.',
        price: 499,
        discountPrice: 449,
        brand: 'Samsung',
        category: catMap['Electronics'],
        image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&auto=format&fit=crop&q=80',
        stock: 25,
        rating: 4.6,
        isFeatured: true
      },
      {
        name: 'Apple Watch Series 9 GPS 45mm',
        description: 'Advanced health tracking, S9 SiP chip, double-tap gesture control, and brighter Always-On display.',
        price: 429,
        discountPrice: 399,
        brand: 'Apple',
        category: catMap['Electronics'],
        image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80',
        stock: 18,
        rating: 4.8,
        isFeatured: true
      },
      {
        name: 'Anker Magnetic 10000mAh Power Bank',
        description: 'Ultra-compact MagSafe compatible battery pack with foldable stand and fast 20W USB-C output.',
        price: 59,
        discountPrice: 49,
        brand: 'Anker',
        category: catMap['Electronics'],
        image: 'https://images.unsplash.com/photo-1609592426507-440263f90b9b?w=800&auto=format&fit=crop&q=80',
        stock: 50,
        rating: 4.5,
        isFeatured: false
      },
      {
        name: 'Amazon Echo Dot 5th Gen Smart Speaker',
        description: 'Deep bass and clear vocals with Alexa voice control, motion sensor, and smart home hub integration.',
        price: 49,
        discountPrice: 39,
        brand: 'Amazon',
        category: catMap['Electronics'],
        image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=800&auto=format&fit=crop&q=80',
        stock: 4, // Low stock < 10
        rating: 4.3,
        isFeatured: false
      },
      {
        name: 'DJI Mini 3 Lightweight Camera Drone',
        description: 'Under 249g foldable drone with 4K HDR video, true vertical shooting, and 38-minute flight time.',
        price: 559,
        discountPrice: 519,
        brand: 'DJI',
        category: catMap['Electronics'],
        image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop&q=80',
        stock: 12,
        rating: 4.7,
        isFeatured: true
      },
      {
        name: 'Belkin 3-in-1 MagSafe Wireless Charger',
        description: 'Fast charge iPhone, Apple Watch, and AirPods simultaneously with official 15W MagSafe technology.',
        price: 149,
        discountPrice: 129,
        brand: 'Belkin',
        category: catMap['Electronics'],
        image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&auto=format&fit=crop&q=80',
        stock: 22,
        rating: 4.4,
        isFeatured: false
      },
      {
        name: 'Roku Streaming Stick 4K HDR',
        description: 'Lightning-fast 4K streaming with Dolby Vision, long-range Wi-Fi receiver, and voice remote.',
        price: 49,
        discountPrice: 34,
        brand: 'Roku',
        category: catMap['Electronics'],
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80',
        stock: 35,
        rating: 4.6,
        isFeatured: false
      },
      {
        name: 'JBL Bar 500 Pro Dolby Atmos Soundbar',
        description: '590W total output with MultiBeam 3D surround sound, 10" wireless subwoofer, and PureVoice.',
        price: 499,
        discountPrice: 429,
        brand: 'JBL',
        category: catMap['Electronics'],
        image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80',
        stock: 14,
        rating: 4.6,
        isFeatured: false
      },
      {
        name: 'Anker Nebula Capsule 3 Laser Projector',
        description: 'Pocket-sized smart laser projector delivering 1080p picture, Google TV, and 2.5-hour playtime.',
        price: 799,
        discountPrice: 699,
        brand: 'Anker',
        category: catMap['Electronics'],
        image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop&q=80',
        stock: 6, // Low stock < 10
        rating: 4.5,
        isFeatured: false
      },
      {
        name: 'TP-Link Kasa Smart Wi-Fi Plug Mini',
        description: 'Compact 15A smart plug with energy monitoring, scheduling, and Alexa/Google Home voice control.',
        price: 24,
        discountPrice: 19,
        brand: 'TP-Link',
        category: catMap['Electronics'],
        image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80',
        stock: 60,
        rating: 4.4,
        isFeatured: false
      },

      // Category 2: Mobile Phones (10 items)
      {
        name: 'Apple iPhone 15 Pro Max 256GB',
        description: 'Aerospace-grade titanium design with A17 Pro chip, 5x Telephoto camera, and Action button.',
        price: 1199,
        discountPrice: 1129,
        brand: 'Apple',
        category: catMap['Mobile Phones'],
        image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80',
        stock: 15,
        rating: 4.9,
        isFeatured: true
      },
      {
        name: 'Samsung Galaxy S24 Ultra 5G',
        description: 'Galaxy AI smartphone with 200MP camera, built-in S Pen, Snapdragon 8 Gen 3, and flat titanium frame.',
        price: 1299,
        discountPrice: 1199,
        brand: 'Samsung',
        category: catMap['Mobile Phones'],
        image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80',
        stock: 16,
        rating: 4.8,
        isFeatured: true
      },
      {
        name: 'Google Pixel 8 Pro 128GB',
        description: 'Google Tensor G3 chip, best-in-class computational photography, and 7 years of OS updates.',
        price: 999,
        discountPrice: 899,
        brand: 'Google',
        category: catMap['Mobile Phones'],
        image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80',
        stock: 20,
        rating: 4.6,
        isFeatured: false
      },
      {
        name: 'OnePlus 12 5G 256GB',
        description: 'Flagship killer with Snapdragon 8 Gen 3, 4th Gen Hasselblad camera, and 100W SUPERVOOC charging.',
        price: 799,
        discountPrice: 749,
        brand: 'OnePlus',
        category: catMap['Mobile Phones'],
        image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&auto=format&fit=crop&q=80',
        stock: 24,
        rating: 4.7,
        isFeatured: false
      },
      {
        name: 'Samsung Galaxy A55 5G',
        description: 'Premium metal frame, 50MP OIS camera, Super AMOLED 120Hz display, and 5000mAh battery.',
        price: 449,
        discountPrice: 399,
        brand: 'Samsung',
        category: catMap['Mobile Phones'],
        image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80',
        stock: 30,
        rating: 4.5,
        isFeatured: false
      },
      {
        name: 'Xiaomi 14 Ultra Leica Optics',
        description: 'Quad 50MP camera array co-engineered with Leica, Stepless variable aperture, and Snapdragon 8 Gen 3.',
        price: 1099,
        discountPrice: 999,
        brand: 'Xiaomi',
        category: catMap['Mobile Phones'],
        image: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&auto=format&fit=crop&q=80',
        stock: 7, // Low stock < 10
        rating: 4.7,
        isFeatured: false
      },
      {
        name: 'Motorola Edge 50 Pro',
        description: 'Pantone-validated 144Hz curved pOLED display, 125W TurboPower charging, and vegan leather back.',
        price: 599,
        discountPrice: 549,
        brand: 'Motorola',
        category: catMap['Mobile Phones'],
        image: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=800&auto=format&fit=crop&q=80',
        stock: 19,
        rating: 4.3,
        isFeatured: false
      },
      {
        name: 'Nothing Phone (2) Transparent Edition',
        description: 'Unique Glyph Interface LED back, Snapdragon 8+ Gen 1, Nothing OS 2.5, and dual 50MP cameras.',
        price: 649,
        discountPrice: 599,
        brand: 'Nothing',
        category: catMap['Mobile Phones'],
        image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80',
        stock: 14,
        rating: 4.6,
        isFeatured: false
      },
      {
        name: 'Apple iPhone 14 128GB Midnight',
        description: 'Reliable A15 Bionic chip, Dual-camera system with Photonic Engine, and all-day battery life.',
        price: 699,
        discountPrice: 649,
        brand: 'Apple',
        category: catMap['Mobile Phones'],
        image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80',
        stock: 22,
        rating: 4.6,
        isFeatured: false
      },
      {
        name: 'Asus ROG Phone 8 Pro Gaming Edition',
        description: 'Ultimate gaming monster with 165Hz AMOLED, AniMe Vision mini-LED rear display, and AirTrigger buttons.',
        price: 1199,
        discountPrice: 1099,
        brand: 'Asus',
        category: catMap['Mobile Phones'],
        image: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800&auto=format&fit=crop&q=80',
        stock: 5, // Low stock < 10
        rating: 4.8,
        isFeatured: false
      },

      // Category 3: Laptops (10 items)
      {
        name: 'Apple MacBook Air 15" M3 Chip',
        description: 'Incredibly thin aluminum design with Liquid Retina display, M3 performance, and 18-hour battery life.',
        price: 1299,
        discountPrice: 1199,
        brand: 'Apple',
        category: catMap['Laptops'],
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
        stock: 15,
        rating: 4.9,
        isFeatured: true
      },
      {
        name: 'Dell XPS 15 OLED InfinityEdge',
        description: 'Intel Core i9 13th Gen, 3.5K OLED touchscreen, NVIDIA GeForce RTX 4060, and CNC aluminum chassis.',
        price: 1899,
        discountPrice: 1749,
        brand: 'Dell',
        category: catMap['Laptops'],
        image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80',
        stock: 10,
        rating: 4.7,
        isFeatured: true
      },
      {
        name: 'Lenovo ThinkPad X1 Carbon Gen 11',
        description: 'Ultra-light carbon fiber business laptop with legendary keyboard, Intel vPro, and robust security.',
        price: 1499,
        discountPrice: 1399,
        brand: 'Lenovo',
        category: catMap['Laptops'],
        image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=80',
        stock: 12,
        rating: 4.8,
        isFeatured: false
      },
      {
        name: 'ASUS ROG Zephyrus G16 Gaming Laptop',
        description: 'Intel Core Ultra 9, RTX 4080 GPU, 2.5K 240Hz OLED ROG Nebula display, and slim metal body.',
        price: 2199,
        discountPrice: 1999,
        brand: 'ASUS',
        category: catMap['Laptops'],
        image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80',
        stock: 8, // Low stock < 10
        rating: 4.9,
        isFeatured: true
      },
      {
        name: 'HP Spectre x360 2-in-1 Laptop',
        description: 'Versatile 16" 2-in-1 convertible with 4K touch display, Intel EVO platform, and rechargeable pen.',
        price: 1399,
        discountPrice: 1249,
        brand: 'HP',
        category: catMap['Laptops'],
        image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&auto=format&fit=crop&q=80',
        stock: 14,
        rating: 4.6,
        isFeatured: false
      },
      {
        name: 'Apple MacBook Pro 16" M3 Max',
        description: 'Extreme workstation power with 16-core CPU, 40-core GPU, Liquid Retina XDR, and 128GB unified memory.',
        price: 3499,
        discountPrice: 3299,
        brand: 'Apple',
        category: catMap['Laptops'],
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
        stock: 6, // Low stock < 10
        rating: 5.0,
        isFeatured: true
      },
      {
        name: 'Acer Swift Go 14 Intel Core Ultra',
        description: 'Portable productivity machine with vibrant 2.8K 90Hz OLED, Intel AI Boost, and fast Thunderbolt 4.',
        price: 849,
        discountPrice: 799,
        brand: 'Acer',
        category: catMap['Laptops'],
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
        stock: 20,
        rating: 4.4,
        isFeatured: false
      },
      {
        name: 'Microsoft Surface Laptop 6 Copilot+',
        description: 'Sleek PixelSense touchscreen laptop optimized for AI workflows with dedicated Copilot key.',
        price: 1199,
        discountPrice: 1099,
        brand: 'Microsoft',
        category: catMap['Laptops'],
        image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80',
        stock: 15,
        rating: 4.5,
        isFeatured: false
      },
      {
        name: 'Razer Blade 15 Dual Mode QHD',
        description: 'Premium compact gaming laptop with CNC anodized chassis, per-key RGB Chroma, and RTX 4070.',
        price: 2399,
        discountPrice: 2199,
        brand: 'Razer',
        category: catMap['Laptops'],
        image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80',
        stock: 7, // Low stock < 10
        rating: 4.7,
        isFeatured: false
      },
      {
        name: 'LG Gram 17 Ultra-Lightweight Laptop',
        description: 'Featherlight 2.98 lbs laptop featuring massive 17" WQXGA IPS screen and high-capacity 80Wh battery.',
        price: 1399,
        discountPrice: 1299,
        brand: 'LG',
        category: catMap['Laptops'],
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80',
        stock: 11,
        rating: 4.6,
        isFeatured: false
      },

      // Category 4: Headphones (10 items)
      {
        name: 'Sony WH-1000XM5 Noise Canceling Headphones',
        description: 'Industry-leading noise cancelation with two processors, 8 microphones, and ultra-comfortable fit.',
        price: 399,
        discountPrice: 349,
        brand: 'Sony',
        category: catMap['Headphones'],
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
        stock: 30,
        rating: 4.9,
        isFeatured: true
      },
      {
        name: 'Apple AirPods Pro 2nd Gen with USB-C',
        description: 'Pro-level Active Noise Cancellation, Adaptive Audio, Personalized Spatial Audio, and MagSafe USB-C case.',
        price: 249,
        discountPrice: 219,
        brand: 'Apple',
        category: catMap['Headphones'],
        image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=80',
        stock: 45,
        rating: 4.8,
        isFeatured: true
      },
      {
        name: 'Bose QuietComfort Ultra Wireless Headphones',
        description: 'World-class spatialized audio and groundbreaking noise cancellation with CustomTune technology.',
        price: 429,
        discountPrice: 379,
        brand: 'Bose',
        category: catMap['Headphones'],
        image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
        stock: 18,
        rating: 4.7,
        isFeatured: false
      },
      {
        name: 'Sennheiser Momentum 4 Wireless',
        description: 'Audiophile-grade 42mm transducer system delivering pristine clarity with epic 60-hour battery life.',
        price: 379,
        discountPrice: 299,
        brand: 'Sennheiser',
        category: catMap['Headphones'],
        image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80',
        stock: 16,
        rating: 4.7,
        isFeatured: false
      },
      {
        name: 'Audio-Technica ATH-M50xBT2 Professional Monitor',
        description: 'Critically acclaimed M50x sonic signature with wireless Bluetooth convenience and LDAC codec support.',
        price: 199,
        discountPrice: 179,
        brand: 'Audio-Technica',
        category: catMap['Headphones'],
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
        stock: 25,
        rating: 4.6,
        isFeatured: false
      },
      {
        name: 'Beats Studio Pro Wireless Over-Ear',
        description: 'Custom acoustic platform delivering rich, immersive sound with Lossless Audio via USB-C.',
        price: 349,
        discountPrice: 249,
        brand: 'Beats',
        category: catMap['Headphones'],
        image: 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=800&auto=format&fit=crop&q=80',
        stock: 20,
        rating: 4.5,
        isFeatured: false
      },
      {
        name: 'Sony WF-1000XM5 True Wireless Earbuds',
        description: 'Astonishing sound quality and the best noise canceling performance in a compact earbud design.',
        price: 299,
        discountPrice: 259,
        brand: 'Sony',
        category: catMap['Headphones'],
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
        stock: 28,
        rating: 4.7,
        isFeatured: false
      },
      {
        name: 'Marshall Major IV Wireless On-Ear Headphones',
        description: 'Iconic Marshall design with 80+ hours of wireless playtime, custom-tuned dynamic drivers, and wireless charging.',
        price: 149,
        discountPrice: 129,
        brand: 'Marshall',
        category: catMap['Headphones'],
        image: 'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=800&auto=format&fit=crop&q=80',
        stock: 9, // Low stock < 10
        rating: 4.6,
        isFeatured: false
      },
      {
        name: 'Shure AONIC 50 Gen 2 Studio Headphones',
        description: 'Engineered from decades of stage experience, featuring adjustable noise cancellation and spatial sound.',
        price: 349,
        discountPrice: 319,
        brand: 'Shure',
        category: catMap['Headphones'],
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
        stock: 12,
        rating: 4.5,
        isFeatured: false
      },
      {
        name: 'Jabra Elite 10 Active Noise Cancelling',
        description: 'Comfort-fit earbuds with Dolby Atmos Spatial Sound, 6-mic call technology, and IP57 dust/water protection.',
        price: 249,
        discountPrice: 199,
        brand: 'Jabra',
        category: catMap['Headphones'],
        image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=80',
        stock: 17,
        rating: 4.4,
        isFeatured: false
      },

      // Category 5: Cameras (10 items)
      {
        name: 'Canon EOS R50 Mirrorless Camera with 18-45mm Lens',
        description: 'Compact and intuitive 24.2 Megapixel mirrorless camera with Dual Pixel CMOS AF II and 4K uncropped video.',
        price: 679,
        discountPrice: 629,
        brand: 'Canon',
        category: catMap['Cameras'],
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
        stock: 14,
        rating: 4.8,
        isFeatured: true
      },
      {
        name: 'Sony Alpha a7 IV Full-Frame Mirrorless',
        description: '33MP Exmor R sensor, BIONZ XR engine, 4K 60p 10-bit recording, and real-time eye autofocus.',
        price: 2499,
        discountPrice: 2299,
        brand: 'Sony',
        category: catMap['Cameras'],
        image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop&q=80',
        stock: 8, // Low stock < 10
        rating: 4.9,
        isFeatured: true
      },
      {
        name: 'Fujifilm X-T5 Mirrorless Digital Camera',
        description: 'Classic analog dial controls paired with modern 40.2MP X-Trans CMOS 5 HR sensor and 7-stop IBIS.',
        price: 1699,
        discountPrice: 1599,
        brand: 'Fujifilm',
        category: catMap['Cameras'],
        image: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=800&auto=format&fit=crop&q=80',
        stock: 11,
        rating: 4.8,
        isFeatured: true
      },
      {
        name: 'Nikon Z50 Creator Kit with 16-50mm VR',
        description: 'DX-format 20.9MP mirrorless kit including compact zoom lens, Rode video micro, and Manfrotto tripod.',
        price: 999,
        discountPrice: 899,
        brand: 'Nikon',
        category: catMap['Cameras'],
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
        stock: 15,
        rating: 4.6,
        isFeatured: false
      },
      {
        name: 'GoPro HERO12 Black Action Camera',
        description: 'HyperSmooth 6.0 video stabilization, HDR 5.3K video, GP-Log encoding, and waterproof down to 33ft.',
        price: 399,
        discountPrice: 349,
        brand: 'GoPro',
        category: catMap['Cameras'],
        image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&auto=format&fit=crop&q=80',
        stock: 25,
        rating: 4.7,
        isFeatured: false
      },
      {
        name: 'DJI Osmo Pocket 3 Gimbal Camera',
        description: '1-inch CMOS sensor, 4K 120fps recording, 3-axis mechanical stabilization, and rotatable 2" OLED screen.',
        price: 519,
        discountPrice: 489,
        brand: 'DJI',
        category: catMap['Cameras'],
        image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop&q=80',
        stock: 13,
        rating: 4.9,
        isFeatured: true
      },
      {
        name: 'Panasonic Lumix S5 II Mirrorless Camera',
        description: 'Phase Hybrid AF, 24.2MP full-frame sensor, unlimited 4K 60p recording with active cooling fan.',
        price: 1999,
        discountPrice: 1799,
        brand: 'Panasonic',
        category: catMap['Cameras'],
        image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop&q=80',
        stock: 7, // Low stock < 10
        rating: 4.7,
        isFeatured: false
      },
      {
        name: 'Canon PowerShot G7 X Mark III Digital Camera',
        description: '1.0-type stacked CMOS sensor, 4K video with vertical support, external mic input, and live streaming.',
        price: 749,
        discountPrice: 699,
        brand: 'Canon',
        category: catMap['Cameras'],
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
        stock: 16,
        rating: 4.5,
        isFeatured: false
      },
      {
        name: 'Insta360 X3 360-Degree Waterproof Action Cam',
        description: 'Captures immersive 5.7K 360-degree footage with Invisible Selfie Stick effect and 72MP photos.',
        price: 449,
        discountPrice: 399,
        brand: 'Insta360',
        category: catMap['Cameras'],
        image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&auto=format&fit=crop&q=80',
        stock: 18,
        rating: 4.6,
        isFeatured: false
      },
      {
        name: 'Leica D-Lux 7 Compact Digital Camera',
        description: 'Prestigious four-thirds sensor compact camera with fast Leica DC Vario-Summilux f/1.7-2.8 lens.',
        price: 1395,
        discountPrice: 1295,
        brand: 'Leica',
        category: catMap['Cameras'],
        image: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=800&auto=format&fit=crop&q=80',
        stock: 5, // Low stock < 10
        rating: 4.8,
        isFeatured: false
      },

      // Category 6: Men's Clothing (10 items)
      {
        name: "Levi's 511 Slim Fit Stretch Denim Jeans",
        description: 'Classic modern slim fit jeans cut close without being too tight, crafted with premium stretch cotton.',
        price: 79,
        discountPrice: 59,
        brand: "Levi's",
        category: catMap["Men's Clothing"],
        image: 'https://images.unsplash.com/photo-1542272604-780c96856592?w=800&auto=format&fit=crop&q=80',
        stock: 40,
        rating: 4.6,
        isFeatured: true
      },
      {
        name: 'Tommy Hilfiger Classic Oxford Cotton Shirt',
        description: 'Timeless button-down collar shirt tailored in breathable organic cotton with signature flag embroidery.',
        price: 89,
        discountPrice: 69,
        brand: 'Tommy Hilfiger',
        category: catMap["Men's Clothing"],
        image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80',
        stock: 35,
        rating: 4.5,
        isFeatured: false
      },
      {
        name: 'Patagonia Better Sweater Fleece Jacket',
        description: 'Warm fleece jacket dyed with a low-impact process that significantly reduces dyestuff and water usage.',
        price: 159,
        discountPrice: 139,
        brand: 'Patagonia',
        category: catMap["Men's Clothing"],
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80',
        stock: 22,
        rating: 4.8,
        isFeatured: true
      },
      {
        name: 'Ralph Lauren Classic Fit Mesh Polo',
        description: 'Iconic polo shirt textured in breathable cotton mesh with signature embroidered pony logo on chest.',
        price: 110,
        discountPrice: 89,
        brand: 'Ralph Lauren',
        category: catMap["Men's Clothing"],
        image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&auto=format&fit=crop&q=80',
        stock: 30,
        rating: 4.7,
        isFeatured: false
      },
      {
        name: 'Nike Sportswear Club Fleece Pullover Hoodie',
        description: 'Brushed-back fleece offers plush warmth and casual comfort for daily athletic styling.',
        price: 65,
        discountPrice: 49,
        brand: 'Nike',
        category: catMap["Men's Clothing"],
        image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
        stock: 50,
        rating: 4.7,
        isFeatured: false
      },
      {
        name: 'The North Face Resolve 2 Waterproof Jacket',
        description: 'DryVent 2L breathable and seam-sealed shell built to repel wind and heavy rainfall.',
        price: 119,
        discountPrice: 99,
        brand: 'The North Face',
        category: catMap["Men's Clothing"],
        image: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800&auto=format&fit=crop&q=80',
        stock: 19,
        rating: 4.6,
        isFeatured: false
      },
      {
        name: 'Calvin Klein Slim Fit Dress Shirt',
        description: 'Crisp stretch cotton dress shirt designed with point collar and clean moisture-wicking fabric.',
        price: 75,
        discountPrice: 55,
        brand: 'Calvin Klein',
        category: catMap["Men's Clothing"],
        image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80',
        stock: 28,
        rating: 4.4,
        isFeatured: false
      },
      {
        name: 'Under Armour Tech 2.0 Short Sleeve T-Shirt',
        description: 'Quick-drying ultra-soft fabric feels natural while wicking perspiration during workouts.',
        price: 25,
        discountPrice: 19,
        brand: 'Under Armour',
        category: catMap["Men's Clothing"],
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
        stock: 65,
        rating: 4.5,
        isFeatured: false
      },
      {
        name: 'Carhartt Loose Fit Heavyweight Pocket Tee',
        description: 'Durable heavyweight cotton t-shirt with side-seam construction to minimize twisting.',
        price: 30,
        discountPrice: 24,
        brand: 'Carhartt',
        category: catMap["Men's Clothing"],
        image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80',
        stock: 45,
        rating: 4.8,
        isFeatured: false
      },
      {
        name: 'Columbia Watertight II Rain Jacket',
        description: 'Omni-Tech waterproof/breathable fully sealed outdoor jacket that packs down into its own pocket.',
        price: 90,
        discountPrice: 69,
        brand: 'Columbia',
        category: catMap["Men's Clothing"],
        image: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800&auto=format&fit=crop&q=80',
        stock: 8, // Low stock < 10
        rating: 4.5,
        isFeatured: false
      },

      // Category 7: Women's Clothing (10 items)
      {
        name: 'Zara Elegant Double-Breasted Tailored Blazer',
        description: 'Structured wool-blend blazer featuring notched lapels, flap pockets, and front button closure.',
        price: 129,
        discountPrice: 99,
        brand: 'Zara',
        category: catMap["Women's Clothing"],
        image: 'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?w=800&auto=format&fit=crop&q=80',
        stock: 20,
        rating: 4.7,
        isFeatured: true
      },
      {
        name: "Levi's 721 High Rise Skinny Jeans",
        description: 'Flattering high-rise cut that hugs figures through the hip and thigh with sculpt fabrication.',
        price: 79,
        discountPrice: 59,
        brand: "Levi's",
        category: catMap["Women's Clothing"],
        image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80',
        stock: 35,
        rating: 4.6,
        isFeatured: true
      },
      {
        name: 'Mango Floral Print Bohemian Maxi Dress',
        description: 'Flowy bohemian maxi dress crafted with lightweight sustainable viscose and ruffled hemline.',
        price: 99,
        discountPrice: 79,
        brand: 'Mango',
        category: catMap["Women's Clothing"],
        image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&auto=format&fit=crop&q=80',
        stock: 18,
        rating: 4.5,
        isFeatured: false
      },
      {
        name: 'Lululemon Align High-Rise Yoga Pant 25"',
        description: 'Buttery-soft Nulu fabric feels weightless and provides unrestricted four-way stretch.',
        price: 98,
        discountPrice: 88,
        brand: 'Lululemon',
        category: catMap["Women's Clothing"],
        image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&auto=format&fit=crop&q=80',
        stock: 26,
        rating: 4.9,
        isFeatured: true
      },
      {
        name: 'H&M Rib-Knit Soft Turtleneck Sweater',
        description: 'Cozy oversized turtleneck knitted with a warm wool and alpaca blend for chilly seasons.',
        price: 49,
        discountPrice: 35,
        brand: 'H&M',
        category: catMap["Women's Clothing"],
        image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop&q=80',
        stock: 40,
        rating: 4.4,
        isFeatured: false
      },
      {
        name: 'The North Face Osito Fleece Jacket',
        description: 'Silky high-pile Raschel fleece delivers plush warmth and tailored silhouette for winter days.',
        price: 109,
        discountPrice: 89,
        brand: 'The North Face',
        category: catMap["Women's Clothing"],
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80',
        stock: 15,
        rating: 4.8,
        isFeatured: false
      },
      {
        name: 'Calvin Klein Modern Cotton Bralette Top',
        description: 'Iconic unlined wireless racerback bralette with signature repeating logo elastic underband.',
        price: 32,
        discountPrice: 26,
        brand: 'Calvin Klein',
        category: catMap["Women's Clothing"],
        image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80',
        stock: 50,
        rating: 4.7,
        isFeatured: false
      },
      {
        name: 'Madewell The Perfect Vintage Jean',
        description: 'High-waisted tapered jeans with magical stretch denim that sculpts and holds all day.',
        price: 128,
        discountPrice: 98,
        brand: 'Madewell',
        category: catMap["Women's Clothing"],
        image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80',
        stock: 7, // Low stock < 10
        rating: 4.6,
        isFeatured: false
      },
      {
        name: 'Patagonia Down With It Parka',
        description: 'Insulated with 600-fill-power 100% Recycled Down with water-resistant exterior finish.',
        price: 349,
        discountPrice: 299,
        brand: 'Patagonia',
        category: catMap["Women's Clothing"],
        image: 'https://images.unsplash.com/photo-1539533018447-63fcce667883?w=800&auto=format&fit=crop&q=80',
        stock: 12,
        rating: 4.9,
        isFeatured: false
      },
      {
        name: 'Everlane The Linen Relaxed Fit Shirt',
        description: 'Airy 100% European linen button-down designed with relaxed drape and chest pocket.',
        price: 88,
        discountPrice: 68,
        brand: 'Everlane',
        category: catMap["Women's Clothing"],
        image: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=800&auto=format&fit=crop&q=80',
        stock: 22,
        rating: 4.5,
        isFeatured: false
      },

      // Category 8: Shoes (10 items)
      {
        name: 'Nike Air Max 270 Running Shoes',
        description: "Nike's biggest heel Air unit provides super-soft cushioning that feels as impossible as it looks.",
        price: 160,
        discountPrice: 139,
        brand: 'Nike',
        category: catMap['Shoes'],
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
        stock: 35,
        rating: 4.8,
        isFeatured: true
      },
      {
        name: 'Adidas Ultraboost Light Performance Runners',
        description: 'Epic energy return with Light BOOST midsole cushioning and Primeknit+ forged upper.',
        price: 190,
        discountPrice: 159,
        brand: 'Adidas',
        category: catMap['Shoes'],
        image: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=800&auto=format&fit=crop&q=80',
        stock: 28,
        rating: 4.8,
        isFeatured: true
      },
      {
        name: 'New Balance 574 Core Classic Sneakers',
        description: 'Versatile hybrid road/trail design with ENCAP midsole cushioning that unites classic suede and mesh.',
        price: 90,
        discountPrice: 79,
        brand: 'New Balance',
        category: catMap['Shoes'],
        image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&auto=format&fit=crop&q=80',
        stock: 40,
        rating: 4.7,
        isFeatured: false
      },
      {
        name: 'Puma Suede Classic XXI Low Top',
        description: 'Heritage street style sneaker featuring full suede upper, synthetic leather lining, and rubber sole.',
        price: 75,
        discountPrice: 59,
        brand: 'Puma',
        category: catMap['Shoes'],
        image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80',
        stock: 32,
        rating: 4.5,
        isFeatured: false
      },
      {
        name: 'Timberland 6-Inch Premium Waterproof Boot',
        description: 'Direct-attach waterproof construction, PrimaLoft insulation, and anti-fatigue comfort footbed.',
        price: 198,
        discountPrice: 169,
        brand: 'Timberland',
        category: catMap['Shoes'],
        image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&auto=format&fit=crop&q=80',
        stock: 14,
        rating: 4.8,
        isFeatured: false
      },
      {
        name: 'Converse Chuck Taylor All Star High Top',
        description: 'Timeless silhouette featuring canvas upper, diamond pattern outsole, and iconic ankle patch.',
        price: 65,
        discountPrice: 49,
        brand: 'Converse',
        category: catMap['Shoes'],
        image: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800&auto=format&fit=crop&q=80',
        stock: 55,
        rating: 4.6,
        isFeatured: false
      },
      {
        name: 'Vans Old Skool Classic Skate Shoes',
        description: 'Iconic side-stripe skate shoe built with durable canvas/suede uppers and signature waffle outsoles.',
        price: 70,
        discountPrice: 55,
        brand: 'Vans',
        category: catMap['Shoes'],
        image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop&q=80',
        stock: 45,
        rating: 4.7,
        isFeatured: false
      },
      {
        name: 'Brooks Ghost 15 Neutral Running Shoes',
        description: 'DNA LOFT v2 midsole foam delivers smooth, distraction-free cushioning for road miles.',
        price: 140,
        discountPrice: 119,
        brand: 'Brooks',
        category: catMap['Shoes'],
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
        stock: 20,
        rating: 4.7,
        isFeatured: false
      },
      {
        name: 'ASICS Gel-Kayano 30 Stability Shoes',
        description: '4D GUIDANCE SYSTEM provides adaptive stability and PureGEL technology delivers softer landings.',
        price: 160,
        discountPrice: 139,
        brand: 'ASICS',
        category: catMap['Shoes'],
        image: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=800&auto=format&fit=crop&q=80',
        stock: 5, // Low stock < 10
        rating: 4.8,
        isFeatured: false
      },
      {
        name: 'On Cloud 5 Lightweight Daily Walkers',
        description: 'Speed-lacing system and CloudTec in Zero-Gravity foam for cushioned all-day movement.',
        price: 140,
        discountPrice: 125,
        brand: 'On Running',
        category: catMap['Shoes'],
        image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&auto=format&fit=crop&q=80',
        stock: 18,
        rating: 4.6,
        isFeatured: false
      },

      // Category 9: Home & Kitchen (10 items)
      {
        name: 'Ninja AF101 4-Quart High Capacity Air Fryer',
        description: 'Crisps with up to 75% less fat than traditional frying methods across wide temperature range.',
        price: 129,
        discountPrice: 99,
        brand: 'Ninja',
        category: catMap['Home & Kitchen'],
        image: 'https://images.unsplash.com/photo-1584269600519-112d071b35e6?w=800&auto=format&fit=crop&q=80',
        stock: 25,
        rating: 4.8,
        isFeatured: true
      },
      {
        name: 'Instant Pot Duo 7-in-1 Multi-Use Cooker',
        description: 'Electric pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker, and warmer.',
        price: 99,
        discountPrice: 79,
        brand: 'Instant Pot',
        category: catMap['Home & Kitchen'],
        image: 'https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?w=800&auto=format&fit=crop&q=80',
        stock: 30,
        rating: 4.7,
        isFeatured: true
      },
      {
        name: 'Nespresso Vertuo Pop+ Coffee & Espresso Maker',
        description: 'Centrifusion technology brews rich crema topped coffee in 5 cup sizes with single button simplicity.',
        price: 129,
        discountPrice: 99,
        brand: 'Nespresso',
        category: catMap['Home & Kitchen'],
        image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&auto=format&fit=crop&q=80',
        stock: 22,
        rating: 4.6,
        isFeatured: false
      },
      {
        name: 'KitchenAid Artisan Series 5-Quart Stand Mixer',
        description: 'Iconic planetary mixing action with 10 speeds to gently knead, thoroughly mix, and whip ingredients.',
        price: 449,
        discountPrice: 379,
        brand: 'KitchenAid',
        category: catMap['Home & Kitchen'],
        image: 'https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=800&auto=format&fit=crop&q=80',
        stock: 12,
        rating: 4.9,
        isFeatured: true
      },
      {
        name: 'Dyson V8 Cordless Vacuum Cleaner',
        description: 'Lightweight and versatile with up to 40 minutes of fade-free suction and Motorbar cleaner head.',
        price: 419,
        discountPrice: 349,
        brand: 'Dyson',
        category: catMap['Home & Kitchen'],
        image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&auto=format&fit=crop&q=80',
        stock: 15,
        rating: 4.7,
        isFeatured: false
      },
      {
        name: 'Le Creuset Enameled Cast Iron Dutch Oven',
        description: 'Legendary French cookware delivering superior heat distribution and retention for stews and roasts.',
        price: 420,
        discountPrice: 360,
        brand: 'Le Creuset',
        category: catMap['Home & Kitchen'],
        image: 'https://images.unsplash.com/photo-1584269600519-112d071b35e6?w=800&auto=format&fit=crop&q=80',
        stock: 8, // Low stock < 10
        rating: 4.9,
        isFeatured: false
      },
      {
        name: 'Philips Sonicare ProtectiveClean Electric Toothbrush',
        description: 'Pressure sensor and 3 cleaning modes remove up to 7x more plaque than a manual toothbrush.',
        price: 89,
        discountPrice: 69,
        brand: 'Philips',
        category: catMap['Home & Kitchen'],
        image: 'https://images.unsplash.com/photo-1559591937-e62fb330f6a6?w=800&auto=format&fit=crop&q=80',
        stock: 35,
        rating: 4.6,
        isFeatured: false
      },
      {
        name: 'Cuisinart 14-Cup Food Processor',
        description: 'Heavy-duty 720W motor swiftly chops, shreds, slices, and purees large batches of ingredients.',
        price: 249,
        discountPrice: 199,
        brand: 'Cuisinart',
        category: catMap['Home & Kitchen'],
        image: 'https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=800&auto=format&fit=crop&q=80',
        stock: 16,
        rating: 4.5,
        isFeatured: false
      },
      {
        name: 'Breville Barista Express Espresso Machine',
        description: 'All-in-one espresso machine with integrated conical burr grinder and microfoam milk texturing wand.',
        price: 699,
        discountPrice: 599,
        brand: 'Breville',
        category: catMap['Home & Kitchen'],
        image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&auto=format&fit=crop&q=80',
        stock: 10,
        rating: 4.8,
        isFeatured: true
      },
      {
        name: 'Cosori Electric Gooseneck Pour-Over Kettle',
        description: 'Precision spout and 5 temperature presets ensure optimal extraction for pour-over coffee and tea.',
        price: 69,
        discountPrice: 55,
        brand: 'Cosori',
        category: catMap['Home & Kitchen'],
        image: 'https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?w=800&auto=format&fit=crop&q=80',
        stock: 4, // Low stock < 10
        rating: 4.7,
        isFeatured: false
      },

      // Category 10: Books (10 items)
      {
        name: 'Atomic Habits by James Clear',
        description: 'An easy & proven way to build good habits and break bad ones through tiny behavioral adjustments.',
        price: 27,
        discountPrice: 18,
        brand: 'Penguin Random House',
        category: catMap['Books'],
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
        stock: 80,
        rating: 4.9,
        isFeatured: true
      },
      {
        name: 'The Psychology of Money by Morgan Housel',
        description: 'Timeless lessons on wealth, greed, and happiness exploring how people think about financial decisions.',
        price: 22,
        discountPrice: 16,
        brand: 'Harriman House',
        category: catMap['Books'],
        image: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=800&auto=format&fit=crop&q=80',
        stock: 60,
        rating: 4.8,
        isFeatured: true
      },
      {
        name: 'Deep Work: Rules for Focused Success by Cal Newport',
        description: 'Guidelines to eliminate cognitive distractions and master complex tasks at an elite level.',
        price: 28,
        discountPrice: 19,
        brand: 'Grand Central Publishing',
        category: catMap['Books'],
        image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80',
        stock: 50,
        rating: 4.7,
        isFeatured: false
      },
      {
        name: 'Sapiens: A Brief History of Humankind',
        description: 'Yuval Noah Harari explores how an unexceptional ape became the ruler of planet Earth.',
        price: 35,
        discountPrice: 24,
        brand: 'Harper',
        category: catMap['Books'],
        image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&auto=format&fit=crop&q=80',
        stock: 45,
        rating: 4.8,
        isFeatured: false
      },
      {
        name: 'Clean Code: Agile Software Craftsmanship',
        description: 'Robert C. Martin introduces software best practices, refactoring methods, and code smells.',
        price: 49,
        discountPrice: 39,
        brand: 'Prentice Hall',
        category: catMap['Books'],
        image: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?w=800&auto=format&fit=crop&q=80',
        stock: 35,
        rating: 4.7,
        isFeatured: true
      },
      {
        name: 'The Pragmatic Programmer 20th Anniversary Edition',
        description: 'David Thomas and Andrew Hunt share actionable insights on modern engineering and career mastery.',
        price: 55,
        discountPrice: 42,
        brand: 'Addison-Wesley',
        category: catMap['Books'],
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
        stock: 28,
        rating: 4.9,
        isFeatured: false
      },
      {
        name: 'Zero to One: Notes on Startups by Peter Thiel',
        description: 'How to build companies that create new things and innovate rather than replicating existing models.',
        price: 25,
        discountPrice: 17,
        brand: 'Crown Business',
        category: catMap['Books'],
        image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80',
        stock: 40,
        rating: 4.6,
        isFeatured: false
      },
      {
        name: 'Thinking, Fast and Slow by Daniel Kahneman',
        description: 'Nobel laureate Daniel Kahneman reveals the two systems that drive the way we think and decide.',
        price: 30,
        discountPrice: 21,
        brand: 'Farrar, Straus and Giroux',
        category: catMap['Books'],
        image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&auto=format&fit=crop&q=80',
        stock: 30,
        rating: 4.6,
        isFeatured: false
      },
      {
        name: 'Rich Dad Poor Dad by Robert Kiyosaki',
        description: 'What the rich teach their kids about money that the poor and middle class do not.',
        price: 20,
        discountPrice: 14,
        brand: 'Plata Publishing',
        category: catMap['Books'],
        image: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=800&auto=format&fit=crop&q=80',
        stock: 75,
        rating: 4.5,
        isFeatured: false
      },
      {
        name: 'Design Patterns: Elements of Reusable Object-Oriented Software',
        description: 'The foundational Gang of Four reference on 23 classic software architectural design patterns.',
        price: 60,
        discountPrice: 48,
        brand: 'Addison-Wesley',
        category: catMap['Books'],
        image: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?w=800&auto=format&fit=crop&q=80',
        stock: 6, // Low stock < 10
        rating: 4.8,
        isFeatured: false
      }
    ];

    const createdProducts = await Product.insertMany(rawProducts);

    // 4. Generate 50 realistic reviews across products
    const reviewComments = [
      'Exceeded my expectations! High quality materials and fast shipping.',
      'Absolutely love this purchase. Solid build and works exactly as described.',
      'Great value for money. Would definitely recommend to anyone looking for this.',
      'Decent product for the price point, though instructions could be slightly clearer.',
      'Outstanding customer experience! Premium feel and top performance.',
      'Very satisfied with how durable and well-crafted it is.',
      'One of the best purchases I have made this year. Five stars all the way!',
      'Good quality, sleek design, arrived safely packaged.',
      'Works wonderfully! Exceeds the standard and looks fantastic.',
      'Really happy with the quality and ease of use. Highly recommend!'
    ];

    const reviewsData = [];
    for (let i = 0; i < 50; i++) {
      const user = customers[i % customers.length];
      const product = createdProducts[i * 2 % createdProducts.length];
      const rating = 4 + (i % 2 === 0 ? 1 : 0); // 4 or 5 star ratings
      const comment = reviewComments[i % reviewComments.length];

      reviewsData.push({
        user: user._id,
        product: product._id,
        rating,
        comment,
        createdAt: new Date(Date.now() - (50 - i) * 86400000)
      });
    }

    await Review.insertMany(reviewsData);

    // Update product review counters
    for (const prod of createdProducts) {
      const revs = await Review.find({ product: prod._id });
      if (revs.length > 0) {
        const avg = Number((revs.reduce((a, b) => a + b.rating, 0) / revs.length).toFixed(1));
        await Product.findByIdAndUpdate(prod._id, {
          rating: avg,
          numReviews: revs.length
        });
      }
    }

    // 5. Generate 20 realistic orders (ALL COD strictly per requirement)
    const orderStatuses = [
      'PLACED', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'DELIVERED',
      'DELIVERED', 'SHIPPED', 'PLACED', 'CANCELLED', 'DELIVERED'
    ];

    const ordersData = [];
    for (let i = 0; i < 20; i++) {
      const customer = customers[i % customers.length];
      const prod1 = createdProducts[(i * 3) % createdProducts.length];
      const prod2 = createdProducts[(i * 3 + 1) % createdProducts.length];

      const price1 = prod1.discountPrice > 0 ? prod1.discountPrice : prod1.price;
      const price2 = prod2.discountPrice > 0 ? prod2.discountPrice : prod2.price;
      const qty1 = 1 + (i % 2);
      const qty2 = 1;
      const totalAmount = price1 * qty1 + price2 * qty2;
      const status = orderStatuses[i % orderStatuses.length];

      ordersData.push({
        user: customer._id,
        products: [
          {
            product: prod1._id,
            name: prod1.name,
            image: prod1.image,
            price: price1,
            quantity: qty1
          },
          {
            product: prod2._id,
            name: prod2.name,
            image: prod2.image,
            price: price2,
            quantity: qty2
          }
        ],
        shippingAddress: {
          name: customer.name,
          phone: customer.phone,
          address: customer.address.addressLine,
          city: customer.address.city,
          state: customer.address.state,
          pincode: customer.address.pincode
        },
        totalAmount,
        paymentMethod: 'COD',
        orderStatus: status,
        createdAt: new Date(Date.now() - (20 - i) * 86400000 * 2)
      });
    }

    await Order.insertMany(ordersData);

    // Output strictly formatted per Section 42
    console.log(`Categories: ${createdCategories.length}`);
    console.log(`Users: ${createdUsers.length}`);
    console.log(`Products: ${createdProducts.length}`);
    console.log(`Reviews: ${reviewsData.length}`);
    console.log(`Orders: ${ordersData.length}`);
    console.log('');
    console.log('Seed completed successfully.');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error during database seeding:', error);
    process.exit(1);
  }
};

seedDatabase();
