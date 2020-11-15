const { response } = require("express");
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuarios.model');
const { generarJWT } = require('../helpers/jwt');

const login = async(req, res = response) => {
    const { email, password } = req.body;
    try {
        // Verificar email
        const usuarioDB = await Usuario.findOne({ email });
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Correo no valido'
            })
        }

        // Verificar contraseña
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Inicio de sesión incorrecto'
            })
        }
        // Generar token -JWT
        const token = await generarJWT(usuarioDB._id);

        res.status(200).json({
            ok: true,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}

module.exports = {
    login
}