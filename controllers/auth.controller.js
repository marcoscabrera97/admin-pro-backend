const { response } = require("express");
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuarios.model');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require("../helpers/google-verify");

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

const googleSignIn = async(req, res = response) => {
    const googleToken = req.body.token;
    try {
        const { name, email, picture } = await googleVerify(googleToken);
        const usuarioDB = await Usuario.findOne({ email });
        let usuario;
        if (!usuarioDB) {
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            })
        } else {
            usuario = usuarioDB;
            usuario.google = true;
        }
        await usuario.save();

        // Generar token -JWT
        const token = await generarJWT(usuario._id);

        res.json({
            ok: true,
            msg: 'Google Signin',
            token
        })
    } catch {
        res.status(401).json({
            ok: false,
            msg: 'Token no es correcto'
        })
    }
}

const renewToken = async(req, res = response) => {

    const uid = req.uid;

    // Generar token -JWT
    const token = await generarJWT(uid);

    // Obtener el usuario por Uid
    const usuario = await Usuario.findById(uid);

    res.json({
        ok: true,
        token,
        usuario
    })
}

module.exports = {
    login,
    googleSignIn,
    renewToken
}