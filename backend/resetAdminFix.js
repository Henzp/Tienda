// E:\Proyecto\tienda\backend\resetAdminFix.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function resetAdmin() {
  try {
    // Conectar a MongoDB directamente
    await mongoose.connect('mongodb://localhost:27017/tienda');
    console.log('Conectado a MongoDB');
    
    // Obtener la referencia a la colección de usuarios
    const usuariosCollection = mongoose.connection.collection('usuarios');
    
    // Eliminar todos los usuarios admin existentes
    await usuariosCollection.deleteMany({ rol: 'admin' });
    console.log('Administradores anteriores eliminados');
    
    // Contraseña en texto plano
    const plainPassword = '123456';
    
    // Generar hash de la contraseña manualmente
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    console.log('Contraseña hasheada:', hashedPassword);
    
    // Crear nuevo documento de admin directamente
    const resultado = await usuariosCollection.insertOne({
      nombre: 'Administrador',
      email: 'admin@ejemplo.com',
      password: hashedPassword,
      rol: 'admin',
      fechaCreacion: new Date()
    });
    
    console.log('Administrador creado con ID:', resultado.insertedId);
    
    // Verificar que podemos recuperar el usuario
    const adminCreado = await usuariosCollection.findOne({ email: 'admin@ejemplo.com' });
    console.log('Admin recuperado:', adminCreado);
    
    // Verificar la contraseña manualmente
    const verificacion = await bcrypt.compare(plainPassword, adminCreado.password);
    console.log('Verificación de contraseña:', verificacion);
    
    console.log('\nAdministrador creado exitosamente:');
    console.log('Email: admin@ejemplo.com');
    console.log('Contraseña: 123456');
    
    await mongoose.disconnect();
    console.log('Desconectado de MongoDB');
  } catch (error) {
    console.error('Error:', error);
    try {
      await mongoose.disconnect();
    } catch (e) {
      // Ignorar error de desconexión
    }
  }
}

resetAdmin();