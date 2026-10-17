 // server.js
 const express = require('express');
 const logger = require('morgan');
 const cors = require('cors');
 const usersRoutes = require('./routes/userRoutes');
 const forumRoutes = require('./routes/forumRoutes');
 
 const app = express();
 const configuredOrigins = (process.env.CORS_ORIGINS || '')
   .split(',')
   .map((origin) => origin.trim())
   .filter(Boolean);
 const allowedOrigins = new Set(configuredOrigins);

 // Middlewares globales
 app.use(logger('dev'));
 app.use(express.json());
 app.use(express.urlencoded({ extended: true }));
 app.use(cors({
   origin(origin, callback) {
     const isLocalDevelopmentOrigin = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin || '');
     if (!origin || isLocalDevelopmentOrigin || allowedOrigins.has(origin)) {
       return callback(null, true);
     }
     return callback(new Error(`Origen CORS no permitido: ${origin}`));
   },
   credentials: true,
   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
 }));
 
 // Rutas
 app.use('/api/users', usersRoutes);
 app.use('/api/forum', forumRoutes);
 
 // Endpoints de prueba
 app.get('/', (req, res) => {
   res.send('Ruta raíz del Backend');
 });
 
 app.get('/test', (req, res) => {
   res.send('Ruta TEST');
 });
 
 // Manejo de errores
 app.use((err, req, res, next) => {
   console.log(err);
   res.status(err.status || 500).send(err.stack);
 });
 
 // Exportamos la app para que la use index.js
 module.exports = app;