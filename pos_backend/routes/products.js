const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// ──── Upload dirs ────
const imgDir = path.join(__dirname, '..', 'uploads', 'products');
const docDir = path.join(__dirname, '..', 'uploads', 'documents');
[imgDir, docDir].forEach(d => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); });

// ──── Multer: accept image + document in one request ────
const uploadBoth = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, file.fieldname === 'document' ? docDir : imgDir);
    },
    filename: (req, file, cb) => {
      const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, unique + path.extname(file.originalname));
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB overall
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'image') {
      const ok = ['image/jpeg', 'image/png', 'image/webp'];
      if (ok.includes(file.mimetype)) return cb(null, true);
      return cb(new Error('Only JPG, PNG, WEBP images allowed'));
    }
    if (file.fieldname === 'document') {
      const ok = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ];
      if (ok.includes(file.mimetype)) return cb(null, true);
      return cb(new Error('Only PDF, DOC, DOCX, XLS, XLSX documents allowed'));
    }
    cb(null, false);
  },
}).fields([
  { name: 'image', maxCount: 1 },
  { name: 'document', maxCount: 1 },
]);

// ──── Helpers ────
function buildUrl(filePath, req) {
  if (!filePath) return null;
  if (filePath.startsWith('http')) return filePath;
  // Always return full URL (works for both local dev and production)
  return `${req.protocol}://${req.get('host')}/${filePath}`;
}

function formatProduct(p, req) {
  return {
    id: p._id,
    name: p.name,
    price: p.price,
    image: p.image,
    image_url: buildUrl(p.image, req),
    document: p.document,
    document_url: buildUrl(p.document, req),
    document_name: p.document_name || null,
    description: p.description,
    status: p.status,
    created_at: p.created_at,
  };
}

// ──── Auto-fix: if image in DB doesn't exist on disk, reassign ────
async function autoFixImage(product) {
  if (!product.image) return false;
  const fullPath = path.join(__dirname, '..', product.image);
  if (fs.existsSync(fullPath)) return false; // file exists, no fix needed

  // Find available image files on disk
  const files = fs.existsSync(imgDir) ? fs.readdirSync(imgDir) : [];
  if (files.length > 0) {
    product.image = `uploads/products/${files[0]}`;
    await product.save();
    return true;
  }
  return false;
}

// ─────────────────────────────────────────
//  GET  /api/products/       → Active products (public)
// ─────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({ status: 'Active' }).sort({ created_at: -1 });
    // Auto-fix broken image paths
    for (const p of products) { await autoFixImage(p); }
    res.json(products.map(p => formatProduct(p, req)));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// ─────────────────────────────────────────
//  POST /api/products/       → Create (admin)
// ─────────────────────────────────────────
router.post('/', optionalAuth, uploadBoth, async (req, res) => {
  try {
    const isAdmin = req.admin || req.isAdminRole || req.headers['x-user-role'] === 'Admin';
    if (!isAdmin) return res.status(403).json({ error: 'Only Admins can create products' });

    const { name, price, description, status } = req.body;
    const files = req.files || {};

    const imagePath = files.image ? `uploads/products/${files.image[0].filename}` : null;
    const docPath   = files.document ? `uploads/documents/${files.document[0].filename}` : null;
    const docName   = files.document ? files.document[0].originalname : null;

    const product = await Product.create({
      name,
      price,
      description: description || null,
      status: status || 'Active',
      image: imagePath,
      document: docPath,
      document_name: docName,
    });

    res.status(201).json(formatProduct(product, req));
  } catch (err) {
    res.status(400).json({ error: err.message || 'Failed to create product' });
  }
});

// ─────────────────────────────────────────
//  GET /api/products/all/    → All products (admin)
// ─────────────────────────────────────────
router.get('/all/', async (req, res) => {
  try {
    const products = await Product.find().sort({ created_at: -1 });
    for (const p of products) { await autoFixImage(p); }
    res.json(products.map(p => formatProduct(p, req)));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// ─────────────────────────────────────────
//  GET /api/products/:id/
// ─────────────────────────────────────────
router.get('/:id/', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(formatProduct(product, req));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// ─────────────────────────────────────────
//  PUT /api/products/:id/    → Update (admin)
// ─────────────────────────────────────────
router.put('/:id/', optionalAuth, uploadBoth, async (req, res) => {
  try {
    const isAdmin = req.admin || req.isAdminRole || req.headers['x-user-role'] === 'Admin';
    if (!isAdmin) return res.status(403).json({ error: 'Only Admins can edit products' });

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const { name, price, description, status } = req.body;
    if (name        !== undefined) product.name        = name;
    if (price       !== undefined) product.price       = price;
    if (description !== undefined) product.description = description;
    if (status      !== undefined) product.status      = status;

    const files = req.files || {};
    if (files.image)    product.image = `uploads/products/${files.image[0].filename}`;
    if (files.document) {
      product.document      = `uploads/documents/${files.document[0].filename}`;
      product.document_name = files.document[0].originalname;
    }

    await product.save();
    res.json(formatProduct(product, req));
  } catch (err) {
    res.status(400).json({ error: err.message || 'Failed to update product' });
  }
});

// ─────────────────────────────────────────
//  DELETE /api/products/:id/
// ─────────────────────────────────────────
router.delete('/:id/', optionalAuth, async (req, res) => {
  try {
    const isAdmin = req.admin || req.isAdminRole || req.headers['x-user-role'] === 'Admin';
    if (!isAdmin) return res.status(403).json({ error: 'Only Admins can delete products' });

    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
