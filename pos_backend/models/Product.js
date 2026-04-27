const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: 100,
  },
  price: {
    type: String,
    required: [true, 'Price is required'],
    maxlength: 50,
  },
  image: {
    type: String,   // Cloudinary URL or local path
    default: null,
  },
  document: {
    type: String,   // Local path to uploaded document (optional)
    default: null,
  },
  document_name: {
    type: String,   // Original filename for display
    default: null,
  },
  description: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active',
  },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  collection: 'pos_products',
});

module.exports = mongoose.model('Product', productSchema);

