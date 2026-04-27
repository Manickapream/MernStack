const express = require('express');
const Inquiry = require('../models/Inquiry');

const router = express.Router();

/**
 * Format an inquiry document into the shape the frontend expects.
 * Mirrors Django's InquirySerializer output.
 */
function formatInquiry(inquiry) {
  return {
    id: inquiry._id,
    product_name: inquiry.product_name,
    price: inquiry.price,
    name: inquiry.name,
    email: inquiry.email,
    mobile: inquiry.mobile,
    message: inquiry.message,
    created_at: inquiry.created_at,
  };
}

// ─────────────────────────────────────────
//  GET  /api/inquiries/     → List all inquiries
//  POST /api/inquiries/     → Create inquiry
// ─────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ created_at: -1 });
    res.json(inquiries.map(formatInquiry));
  } catch (error) {
    console.error('Get inquiries error:', error);
    res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { product_name, price, name, email, mobile, message } = req.body;

    if (!name || !email || !mobile || !message) {
      return res.status(400).json({ error: 'Name, email, mobile, and message are required' });
    }

    const inquiry = await Inquiry.create({
      product_name: product_name || '',
      price: price || '',
      name,
      email,
      mobile,
      message,
    });

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully!',
    });
  } catch (error) {
    console.error('Create inquiry error:', error);
    res.status(400).json({ error: error.message || 'Failed to create inquiry' });
  }
});

// ─────────────────────────────────────────
//  DELETE /api/inquiries/:id/   → Delete inquiry
// ─────────────────────────────────────────
router.delete('/:id/', async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }
    res.json({ success: true, message: 'Inquiry deleted' });
  } catch (error) {
    console.error('Delete inquiry error:', error);
    res.status(500).json({ error: 'Failed to delete inquiry' });
  }
});

module.exports = router;
