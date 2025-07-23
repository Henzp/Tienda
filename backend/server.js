const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Servir archivos estáticos (para las imágenes)
app.use('/assets', express.static(path.join(__dirname, '../src/assets')));

// Conexión a MongoDB Atlas
mongoose.connect('mongodb+srv://tiendamotos:pass123456@motomoto.ymvclyi.mongodb.net/tiendamotos?retryWrites=true&w=majority&appName=motomoto', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Conectado a MongoDB Atlas'))
.catch(err => console.error('Error al conectar a MongoDB:', err));

// Rutas
const productosRoutes = require('./routes/productos');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const usuariosRoutes = require('./routes/usuarios');
const categoriasRoutes = require('./routes/categorias');
const pedidosRoutes = require('./routes/pedidos');
const contactoRoutes = require('./routes/contacto');

app.use('/api/admin/usuarios', usuariosRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/admin/productos', productosRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/categorias', categoriasRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/contacto', contactoRoutes);

// Añadir una ruta específica para categorías (esto es temporal para diagnosticar)
app.get('/api/productos/categoria/:categoria', async (req, res) => {
    try {
      console.log(`[RUTA DIRECTA] Buscando productos con categoría: "${req.params.categoria}"`);
      
      const Producto = require('./models/producto');
      const productos = await Producto.find({
        categoria: req.params.categoria
      });
      
      console.log(`[RUTA DIRECTA] Se encontraron ${productos.length} productos`);
      res.json(productos);
    } catch (error) {
      console.error('[RUTA DIRECTA] Error:', error);
      res.status(500).json({ mensaje: error.message });
    }
});

// Puerto del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});