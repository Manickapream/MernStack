const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  product_name: {
    type: String,
    maxlength: 100,
    default: '',
  },
  price: {
    type: String,
    maxlength: 50,
    default: '',
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    maxlength: 100,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    maxlength: 100,
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    maxlength: 15,
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
  },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  collection: 'pos_inquiries',
});

module.exports = mongoose.model('Inquiry', inquirySchema);
