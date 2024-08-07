const express = require('express');
const path = require('path');
const router = express.Router();
let products = require('../data/products.json');

// Vista Home
router.get('/', (req, res) => {
  res.render('home', { products });
});

// Vista realTimeProducts
router.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts', { products });
});

module.exports = router;
