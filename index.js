require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config');
// Crear el servidor express
const app = express();

// Configurar CORS
app.use(cors());

//Base connection
dbConnection();

console.log(process.env);
// mean_user
// bzN0FZuJzQDo6vgs
// Rutas
app.get('/', (req, res) => {
    res.status(400).json({
        ok: true,
        msg: 'Hola mundo'
    });
});

app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto ' + process.env.PORT);
});