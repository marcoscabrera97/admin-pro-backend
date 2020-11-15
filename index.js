require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config');
// Crear el servidor express
const app = express();

// Configurar CORS
app.use(cors());

// Lectura y parseo del body
app.use(express.json());

//Base connection
dbConnection();

console.log(process.env);
// mean_user
// bzN0FZuJzQDo6vgs
// Rutas
app.use('/api/usuarios', require('./routes/usuarios.routes'));
app.use('/api/login', require('./routes/auth.routes'));


app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto ' + process.env.PORT);
});