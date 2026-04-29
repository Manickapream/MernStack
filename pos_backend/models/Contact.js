const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    maxlength: 100,
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    maxlength: 100,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    maxlength: 100,
  },
  updates: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
  },
}, {
  timestamps: true,
  collection: 'pos_contacts',
});

module.exports = mongoose.model('Contact', contactSchema);
