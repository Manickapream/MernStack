const express = require('express');
const Contact = require('../models/Contact');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, updates, message } = req.body;

    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({ error: 'All fields except updates are required' });
    }

    await Contact.create({
      firstName,
      lastName,
      email,
      updates: !!updates,
      message,
    });

    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully!',
    });
  } catch (error) {
    console.error('Create contact error:', error);
    res.status(400).json({ error: error.message || 'Failed to submit contact form' });
  }
});

router.delete('/:id/', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json({ success: true, message: 'Contact deleted' });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({ error: 'Failed to delete contact' });
  }
});

module.exports = router;
