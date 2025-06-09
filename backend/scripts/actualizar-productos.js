// Puedes agregar este código temporalmente a server.js o crear un script aparte
// para actualizar los productos que no tengan la propiedad destacado
async function actualizarProductos() {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('Conectado a MongoDB');
      
      // Actualizar todos los productos que no tengan destacado
      const resultado = await Producto.updateMany(
        { destacado: { $exists: false } },
        { $set: { destacado: false } }
      );
      
      console.log(`Productos actualizados: ${resultado.modifiedCount}`);
    } catch (error) {
      console.error('Error al actualizar productos:', error);
    } finally {
      mongoose.disconnect();
      console.log('Desconectado de MongoDB');
    }
  }
  
  // Llamar a la función
  actualizarProductos();