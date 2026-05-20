require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');

const products = [
  { name: 'Wireless Noise-Cancelling Headphones', description: 'Premium audio with 30hr battery and active noise cancellation. Foldable design, USB-C charging, and multipoint pairing for seamless device switching.', price: 2499, originalPrice: 3999, category: 'Electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', stock: 50, featured: true, rating: 4.5, numReviews: 128, tags: ['headphones', 'audio', 'wireless'] },
  { name: 'Mechanical Gaming Keyboard', description: 'RGB backlit mechanical keyboard with Cherry MX Red switches, N-key rollover, and aluminium chassis. Built for competitive gaming.', price: 3999, originalPrice: 5999, category: 'Electronics', image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400', stock: 30, featured: true, rating: 4.7, numReviews: 86, tags: ['keyboard', 'gaming', 'rgb'] },
  { name: 'Slim Fit Cotton T-Shirt', description: 'Premium 100% combed cotton t-shirt with a modern slim fit. Preshrunk fabric, reinforced collar, machine washable.', price: 599, originalPrice: 999, category: 'Clothing', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', stock: 200, featured: false, rating: 4.2, numReviews: 312, tags: ['tshirt', 'cotton', 'casual'] },
  { name: 'Running Shoes - ProFlex 3.0', description: 'Lightweight running shoes with responsive cushioning, breathable mesh upper, and grippy rubber outsole. Ideal for road and track running.', price: 4499, originalPrice: 6499, category: 'Sports', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', stock: 60, featured: true, rating: 4.6, numReviews: 204, tags: ['shoes', 'running', 'sports'] },
  { name: 'Stainless Steel Water Bottle', description: '1L vacuum-insulated bottle keeping drinks cold 24hr, hot 12hr. BPA-free, leak-proof lid, and wide mouth for ice cubes.', price: 899, originalPrice: 1299, category: 'Sports', image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400', stock: 150, featured: false, rating: 4.8, numReviews: 445, tags: ['bottle', 'hydration', 'eco'] },
  { name: 'The Art of Clean Code', description: 'A practical guide to writing maintainable, readable, and elegant code. Covers patterns, principles, and real-world refactoring techniques.', price: 649, originalPrice: 999, category: 'Books', image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400', stock: 80, featured: false, rating: 4.9, numReviews: 567, tags: ['programming', 'books', 'code'] },
  { name: 'Smart LED Desk Lamp', description: 'Touch-controlled LED desk lamp with 5 colour temperatures, 10 brightness levels, USB charging port, and memory function.', price: 1299, originalPrice: 1999, category: 'Home & Garden', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400', stock: 75, featured: true, rating: 4.4, numReviews: 93, tags: ['lamp', 'led', 'home office'] },
  { name: 'Yoga Mat Pro', description: 'Extra thick 6mm non-slip yoga mat with alignment lines, carrying strap, and eco-friendly TPE material. Suitable for yoga, pilates, and stretching.', price: 1799, originalPrice: 2499, category: 'Sports', image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400', stock: 100, featured: false, rating: 4.5, numReviews: 178, tags: ['yoga', 'fitness', 'mat'] },
  { name: 'Vitamin C Face Serum', description: '20% vitamin C brightening serum with hyaluronic acid and vitamin E. Reduces dark spots, boosts collagen, and gives glowing skin. Dermatologist tested.', price: 1199, originalPrice: 1899, category: 'Beauty', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400', stock: 120, featured: false, rating: 4.3, numReviews: 289, tags: ['serum', 'skincare', 'vitamin c'] },
  { name: 'Portable Bluetooth Speaker', description: '360° surround sound speaker with 20hr battery, IPX7 waterproof rating, and built-in mic. Connect two speakers for stereo mode.', price: 2999, originalPrice: 3999, category: 'Electronics', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400', stock: 45, featured: true, rating: 4.6, numReviews: 156, tags: ['speaker', 'bluetooth', 'portable'] },
  { name: 'Lego Architecture Set', description: 'Build iconic world landmarks with this 1,000+ piece architecture set. Includes detailed instructions booklet and display stand.', price: 3499, originalPrice: 4999, category: 'Toys', image: 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=400', stock: 35, featured: false, rating: 4.8, numReviews: 72, tags: ['lego', 'building', 'kids'] },
  { name: 'Denim Jacket - Classic', description: 'Classic indigo denim jacket with button closure, chest pockets, and adjustable waist tabs. Machine washable. Available in all sizes.', price: 2299, originalPrice: 3499, category: 'Clothing', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', stock: 90, featured: false, rating: 4.4, numReviews: 134, tags: ['jacket', 'denim', 'fashion'] }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([User.deleteMany(), Product.deleteMany()]);
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@store.com',
      password: 'admin123',
      role: 'admin'
    });
    console.log(`👤 Admin created: admin@store.com / admin123`);

    // Create demo user
    await User.create({
      name: 'Demo User',
      email: 'user@store.com',
      password: 'user123',
      role: 'user'
    });
    console.log(`👤 Demo user created: user@store.com / user123`);

    // Insert products
    await Product.insertMany(products);
    console.log(`📦 ${products.length} products seeded`);

    console.log('\n✅ Seed complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();
