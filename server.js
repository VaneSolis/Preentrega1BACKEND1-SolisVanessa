const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const port = 8080;

const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');
const viewsRouter = require('./routes/views');

app.use(express.json()); // Para procesar JSON

// Configurar Handlebars
const exphbs = require('express-handlebars');
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Configurar rutas estáticas
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

const server = createServer(app);
const io = new Server(server);

// Manejar eventos de conexión de WebSocket
io.on('connection', (socket) => {
  console.log('New client connected');

  // Emitir productos actuales al cliente recién conectado
  socket.emit('products', require('./data/products.json'));

  // Escuchar cambios en los productos
  socket.on('updateProducts', () => {
    socket.emit('products', require('./data/products.json'));
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = io;

