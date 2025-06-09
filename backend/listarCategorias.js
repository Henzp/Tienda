const mongoose = require('mongoose');
const Producto = require('./models/producto'); // Cambiado de '../models/producto' a './models/producto'

mongoose.connect('mongodb://localhost:27017/tiendamotos', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(async () => {
    console.log('Conectado a MongoDB');
    
    try {
        // Obtener todas las categorías únicas de los productos
        const categoriasUnicas = await Producto.distinct('categoria');
        console.log('Categorías únicas encontradas en productos:', categoriasUnicas);
        console.log(`Total: ${categoriasUnicas.length} categorías`);
        
    } catch (error) {
        console.error('Error al listar categorías:', error);
    } finally {
        mongoose.disconnect();
        console.log('Desconectado de MongoDB');
    }
})
.catch(err => console.error('Error al conectar a MongoDB:', err));