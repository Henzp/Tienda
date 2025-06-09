const mongoose = require('mongoose');
const Producto = require('../models/producto');
const Categoria = require('../models/categoria');

mongoose.connect('mongodb://localhost:27017/tiendamotos', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(async () => {
    console.log('Conectado a MongoDB');
    
    try {
        // Obtener todas las categorías únicas de los productos
        const categoriasUnicas = await Producto.distinct('categoria');
        console.log('Categorías únicas encontradas:', categoriasUnicas);
        
        // Crear categorías si no existen
        for (const nombreCategoria of categoriasUnicas) {
            const categoriaExistente = await Categoria.findOne({ nombre: nombreCategoria });
            
            if (!categoriaExistente) {
                const nuevaCategoria = new Categoria({
                    nombre: nombreCategoria,
                    descripcion: `Categoría de ${nombreCategoria}`,
                    activa: true
                });
                
                await nuevaCategoria.save();
                console.log(`Categoría creada: ${nombreCategoria}`);
            } else {
                console.log(`La categoría ${nombreCategoria} ya existe`);
            }
        }
        
        // Actualizar la estructura de productos para que usen el ID de categoría
        const categorias = await Categoria.find();
        const categoriasMap = {};
        
        categorias.forEach(cat => {
            categoriasMap[cat.nombre] = cat._id;
        });
        
        // Actualizar todos los productos
        const productos = await Producto.find();
        
        for (const producto of productos) {
            if (typeof producto.categoria === 'string' && categoriasMap[producto.categoria]) {
                producto.categoriaId = categoriasMap[producto.categoria];
                // Mantener el campo categoria actual como compatibilidad o eliminarlo
                // Opción 1: Mantener para compatibilidad
                // producto.categoriaNombre = producto.categoria;
                // Opción 2: Eliminar
                // delete producto.categoria;
                
                await producto.save();
                console.log(`Producto actualizado: ${producto.nombre}`);
            }
        }
        
        console.log('Migración completada');
    } catch (error) {
        console.error('Error durante la migración:', error);
    } finally {
        mongoose.disconnect();
    }
})
.catch(err => console.error('Error al conectar a MongoDB:', err));