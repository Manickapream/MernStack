const express = require('express');
const Product = require('../models/Product');
const Inquiry = require('../models/Inquiry');

const router = express.Router();

// ─────────────────────────────────────────
//  GET /api/dashboard/stats/   → Dashboard statistics
// ─────────────────────────────────────────
router.get('/stats/', async (req, res) => {
  try {
    const [totalProducts, totalInquiries, totalAllProducts] = await Promise.all([
      Product.countDocuments({ status: 'Active' }),
      Inquiry.countDocuments(),
      Product.countDocuments(),
    ]);

    res.json({
      total_products: totalProducts,
      total_inquiries: totalInquiries,
      total_all_products: totalAllProducts,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

module.exports = router;
