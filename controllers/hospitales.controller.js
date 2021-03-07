const { response } = require('express')
const Hospital = require('../models/hospital.model')
const getHospitales = async(req, res = response) => {
    const hospitales = await Hospital.find()
        .populate('usuario', 'nombre img');
    res.json({
        ok: true,
        hospitales
    })
}

const crearHosptial = async(req, res = response) => {
    const uid = req.uid;
    const hospital = new Hospital({
        usuario: uid,
        ...req.body
    });

    try {
        const hospitalDB = await hospital.save();

        res.json({
            ok: true,
            hospital: hospitalDB
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, hable con el administrador'
        })
    }
}

const actualizarHospital = async(req, res = response) => {
    console.log(req.body);
    const id = req.params.id;
    const uid = req.uid;

    try {

        const hospital = await Hospital.findById(id);
        if (!hospital) {
            return res.status(404).json({
                ok: false,
                msg: 'Hospital no econtrado por id'
            })
        }
        const cambiosHospital = {
            ...req.body,
            usuario: uid
        }
        console.log(cambiosHospital);
        const hospitalActualizado = await Hospital.findByIdAndUpdate(id, cambiosHospital, { new: true });

        res.json({
            ok: true,
            hospital: hospitalActualizado
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

const borrarHospital = async(req, res = response) => {
    const id = req.params.id;

    try {
        const hospital = await Hospital.findById(id);
        if (!hospital) {
            return res.status(404).json({
                ok: false,
                msg: 'Hospital no econtrado por id'
            })
        }

        await Hospital.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Hospitla eliminado'
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

module.exports = {
    getHospitales,
    crearHosptial,
    actualizarHospital,
    borrarHospital
}