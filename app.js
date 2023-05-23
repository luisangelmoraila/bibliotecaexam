const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
  });

// Conexión a la base de datos de MongoDB en Atlas
mongoose.connect('mongodb+srv://luisteitor:Cerrarlapuert4@cluster0.x8kcmvv.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  authSource: 'admin'
}).then(() => {
  console.log('Conexión a la base de datos establecida');
}).catch(err => {
  console.log('Error al conectar a la base de datos:', err.message);
});

// Definición del esquema de tiendas
const tiendaSchema = new mongoose.Schema({
    fecha: Date,
    nombre: String,
    descripcion: String,
    precio: Number,
    cantidad: Number
  });
  
  const Tienda = mongoose.model('Tienda', tiendaSchema);
  
  app.use(bodyParser.json());

  
// Ruta para obtener todas las tiendas
app.get('/tiendas', async (req, res) => {
    try {
      const tienda = await Tienda.find({});
      res.json(tienda);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Ruta para crear una nueva tienda
  app.post('/tiendas', async (req, res) => {
    const tienda = new Tienda({
      fecha: req.body.fecha,
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      precio: req.body.precio,
      cantidad: req.body.cantidad
    });
  
    try {
      const nuevoTienda = await tienda.save();
      res.status(201).json(nuevoTienda);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  // Ruta para obtener una tienda por su ID
app.get('/tiendas/:id', getTienda, (req, res) => {
    res.json(res.tienda);
  });

  // Ruta para actualizar una tienda por su ID
app.patch('/tiendas/:id', getTienda, async (req, res) => {
    if (req.body.fecha != null) {
        res.tienda.fecha = req.body.fecha;
      }
    if (req.body.nombre != null) {
      res.tienda.nombre = req.body.nombre;
    }
    if (req.body.descripcion != null) {
      res.tiena.descripcion = req.body.descripcion;
    }
    if (req.body.precio != null) {
      res.tienda.precio = req.body.precio;
    }
    if (req.body.cantidad != null) {
        res.tienda.cantidad = req.body.cantidad;
      }
  
    try {
      const tiendaActualizado = await res.tienda.save();
      res.json(tiendaActualizado);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  // Ruta para eliminar una tienda por su ID
app.delete('/tiendas/:id', getTienda, async (req, res) => {
    try {
      await res.tienda.deleteOne();
      res.json({ message: 'Tienda eliminada'});
  } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  // Middleware para obtener una tienda por su ID
async function getTienda(req, res, next) {
    let tienda;
    try {
      tienda = await Tienda.findById(req.params.id);
      if (tienda == null) {
        return res.status(404).json({ message: 'Tienda no encontrada' });
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  
    res.tienda = tienda;
    next();
  }
  
  // Manejo de errores
  app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Algo salió mal!');
  });