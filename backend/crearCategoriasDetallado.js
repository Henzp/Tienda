const mongoose = require('mongoose');
const Producto = require('./models/producto'); // Ruta corregida
const Categoria = require('./models/categoria'); // Ruta corregida

mongoose.connect('mongodb://localhost:27017/tiendamotos', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(async () => {
    console.log('==== Iniciando creación de categorías ====');
    console.log('Conectado a MongoDB correctamente');
    
    try {
        // Obtener categorías únicas directamente de los productos
        const categoriasUnicas = await Producto.distinct('categoria');
        console.log(`Se encontraron ${categoriasUnicas.length} categorías únicas en productos:`);
        console.log(categoriasUnicas);
        
        if (categoriasUnicas.length === 0) {
            console.log('⚠️ ADVERTENCIA: No se encontraron categorías en los productos');
        }
        
        // Crear cada categoría
        let creadas = 0;
        let existentes = 0;
        let errores = 0;
        
        for (const nombre of categoriasUnicas) {
            // Validación
            if (!nombre || nombre.trim() === '') {
                console.log('⚠️ Se encontró una categoría con nombre vacío, saltando...');
                continue;
            }
            
            console.log(`Procesando: "${nombre}"`);
            
            try {
                // Verificar si ya existe
                const categoriaExistente = await Categoria.findOne({ nombre: nombre });
                
                if (categoriaExistente) {
                    console.log(`  → La categoría "${nombre}" ya existe (ID: ${categoriaExistente._id})`);
                    existentes++;
                } else {
                    // Crear la categoría
                    const nuevaCategoria = new Categoria({
                        nombre: nombre,
                        descripcion: `Categoría de productos: ${nombre}`,
                        activa: true
                    });
                    
                    const categoriaGuardada = await nuevaCategoria.save();
                    console.log(`  ✅ Categoría creada: "${nombre}" (ID: ${categoriaGuardada._id})`);
                    creadas++;
                }
            } catch (error) {
                console.error(`  ❌ Error al procesar categoría "${nombre}":`, error);
                errores++;
            }
        }
        
        console.log('\n==== Resumen ====');
        console.log(`Total categorías encontradas: ${categoriasUnicas.length}`);
        console.log(`Categorías ya existentes: ${existentes}`);
        console.log(`Categorías nuevas creadas: ${creadas}`);
        console.log(`Errores: ${errores}`);
        console.log('==== Fin del proceso ====');
        
    } catch (error) {
        console.error('❌ Error general:', error);
    } finally {
        mongoose.disconnect();
        console.log('Desconectado de MongoDB');
    }
})
.catch(err => {
    console.error('❌ Error al conectar a MongoDB:', err);
});