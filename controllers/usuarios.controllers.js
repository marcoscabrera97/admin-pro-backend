const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuarios.model');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async(req, res) => {
    const desde = Number(req.query.desde) || 0;
    console.log(desde);

    const [usuario, total] = await Promise.all([
        Usuario
        .find({}, 'nombre email role google')
        .skip(desde)
        .limit(5),
        Usuario.countDocuments()
    ])

    res.json({
        ok: true,
        usuario,
        total
    });
}

const crearUsuario = async(req, res = response) => {
    const { email, password } = req.body;

    try {
        const existeEmail = await Usuario.findOne({ email: email });

        if (existeEmail) {
            return res.status(400).jsonp({
                ok: false,
                msg: 'El correo está registrado'
            })
        }

        const usuario = new Usuario(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        // Guardar usuario
        await usuario.save();

        // Generar token -JWT
        const token = await generarJWT(usuario._id);

        res.json({
            ok: true,
            usuario,
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }
}

const actualizarUsuario = async(req, res = response) => {
    // TODO: Validar token y comporobar si es el usuario correcto
    const uid = req.params.id;
    try {
        const usuarioDB = await Usuario.find({ _id: uid });
        if (usuarioDB[0].length) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }

        // Actualizaciones 
        const { password, google, email, ...campos } = req.body;
        if (usuarioDB[0].email !== email) {
            const existeEmail = await Usuario.findOne({ email })
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                })
            }
        }
        campos.email = email;
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });


        res.json({
            ok: true,
            usuario: usuarioActualizado
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}

const borrarUsuario = async(req, res = response) => {
    const uid = req.params.id;
    try {
        const usuarioDB = await Usuario.find({ _id: uid });
        console.log(usuarioDB);
        if (usuarioDB.length == 0) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }
        await Usuario.findOneAndDelete({ _id: uid });
        res.status(200).json({
            ok: true,
            msg: 'Usuario borrado'
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
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}