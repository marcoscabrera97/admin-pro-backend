/*
    Hospitales
    ruta: '/api/hospitales'
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { getHospitales, crearHosptial, actualizarHospital, borrarHospital } = require('../controllers/hospitales.controller');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', validarJWT, getHospitales);
router.post('/', [
        validarJWT,
        check('nombre', 'El nombre del hospital es obligatorio').not().isEmpty(),
        validarCampos
    ],
    crearHosptial
);
router.put('/:id', [
        validarJWT,
        check('nombre', 'El nombre del hospital es obligatorio').not().isEmpty(),
        validarCampos
    ],
    actualizarHospital
);

router.delete('/:id', validarJWT, borrarHospital)


module.exports = router;