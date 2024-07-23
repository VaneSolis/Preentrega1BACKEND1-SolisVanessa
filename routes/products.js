const express = require('express');
const fs = require('fs');
const router = express.Router();
const path = require('path');
const filePath = path.join(__dirname, '../data/products.json');

let products = require(filePath);

const saveProducts = () => {
  fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
};

// GET / - Listar todos los productos
router.get('/', (req, res) => {
  const { limit } = req.query;
  const productList = limit ? products.slice(0, parseInt(limit)) : products;
  res.json(productList);
});

// GET /:pid - Obtener un producto por ID
router.get('/:pid', (req, res) => {
  const { pid } = req.params;
  const product = products.find(p => p.id === pid);
  if (product) {
    res.json(product);
  } else {
    res.status(404).send('Product not found');
  }
});

// POST / - Agregar un nuevo producto
router.post('/', (req, res) => {
  const { title, description, code, price, status = true, stock, category, thumbnails = [] } = req.body;
  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).send('All fields except thumbnails are required');
  }
  const newProduct = {
    id: (products.length + 1).toString(),
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails
  };
  products.push(newProduct);
  saveProducts();
  res.status(201).json(newProduct);
});

// PUT /:pid - Actualizar un producto por ID
router.put('/:pid', (req, res) => {
  const { pid } = req.params;
  const { title, description, code, price, status, stock, category, thumbnails } = req.body;
  const productIndex = products.findIndex(p => p.id === pid);
  if (productIndex === -1) {
    return res.status(404).send('Product not found');
  }
  const updatedProduct = {
    ...products[productIndex],
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails
  };
  products[productIndex] = updatedProduct;
  saveProducts();
  res.json(updatedProduct);
});

// DELETE /:pid - Eliminar un producto por ID
router.delete('/:pid', (req, res) => {
  const { pid } = req.params;
  const productIndex = products.findIndex(p => p.id === pid);
  if (productIndex === -1) {
    return res.status(404).send('Product not found');
  }
  products.splice(productIndex, 1);
  saveProducts();
  res.status(204).send();
});

module.exports = router;

