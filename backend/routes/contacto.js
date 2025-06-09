const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config();

// Opcionalmente, si quieres guardar los mensajes en la base de datos
// const Mensaje = require('../models/mensaje');

// Configuración del transporte de correo
const transporter = nodemailer.createTransport({
  service: 'gmail',  // puedes cambiar por tu proveedor de correo
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Ruta para enviar mensajes de contacto
router.post('/', async (req, res) => {
  try {
    const { nombre, email, asunto, mensaje } = req.body;
    
    console.log('Recibido mensaje de contacto:', { nombre, email, asunto });
    
    // Validar datos
    if (!nombre || !email || !asunto || !mensaje) {
      return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
    }
    
    // Opción 1: Enviar correo electrónico
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'moto.chile.store@gmail.com', // Correo de destino
      subject: `Mensaje de contacto: ${asunto}`,
      html: `
        <h3>Nuevo mensaje de contacto</h3>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Asunto:</strong> ${asunto}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${mensaje}</p>
      `
    };
    
    // Enviar correo
    await transporter.sendMail(mailOptions);
    
    // Opción 2: Guardar en base de datos (opcional)
    /*
    const nuevoMensaje = new Mensaje({
      nombre,
      email,
      asunto,
      mensaje,
      fecha: new Date()
    });
    
    await nuevoMensaje.save();
    */
    
    res.status(200).json({ 
      mensaje: 'Mensaje enviado correctamente',
      exito: true 
    });
    
  } catch (error) {
    console.error('Error al procesar mensaje de contacto:', error);
    res.status(500).json({ 
      mensaje: 'Error al enviar el mensaje. Inténtalo de nuevo más tarde',
      error: error.toString() 
    });
  }
});

module.exports = router;