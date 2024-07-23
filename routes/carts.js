const express = require('express');
const fs = require('fs');
const router = express.Router();
const path = require('path');
const filePath = path.join(__dirname, '../data/carts.json');

let carts = require(filePath);

const saveCarts = () => {
  fs.writeFileSync(filePath, JSON.stringify(carts, null, 2));
};

// POST / - Crear un nuevo carrito
router.post('/', (req, res) => {
  const newCart = {
    id: (carts.length + 1).toString(),
    products: []
  };
  carts.push(newCart);
  saveCarts();
  res.status(201).json(newCart);
});

// GET /:cid - Listar productos de un carrito por ID
router.get('/:cid', (req, res) => {
  const { cid } = req.params;
  const cart = carts.find(c => c.id === cid);
  if (cart) {
    res.json(cart.products);
  } else {
    res.status(404).send('Cart not found');
  }
});

// POST /:cid/product/:pid - Agregar un producto al carrito
router.post('/:cid/product/:pid', (req, res) => {
  const { cid, pid } = req.params;
  const cart = carts.find(c => c.id === cid);
  if (!cart) {
    return res.status(404).send('Cart not found');
  }

  const productIndex = cart.products.findIndex(p => p.product === pid);
  if (productIndex === -1) {
    cart.products.push({ product: pid, quantity: 1 });
  } else {
    cart.products[productIndex].quantity += 1;
  }
  
  saveCarts();
  res.status(201).json(cart);
});

module.exports = router;

