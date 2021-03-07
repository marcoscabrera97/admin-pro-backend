const { response } = require('express');
const Medico = require('../models/medico.model');
const Hospital = require('../models/hospital.model');

const getMedicos = async(req, res = response) => {
    const medicos = await Medico.find()
        .populate('usuario', 'nombre img')
        .populate('hospital', 'nombre');
    res.json({
        ok: true,
        medicos
    })
}

const getMedicoById = async(req, res = response) => {
    const id = req.params.id;
    try{
        const medico = await Medico.findById(id)
            .populate('usuario', 'nombre img')
            .populate('hospital', 'nombre img');
        res.json({
            ok: true,
            medico
        })
    }catch(error){
        console.log(error);
        res.json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

const crearMedico = async(req, res = response) => {
    const uid = req.uid;
    const medico = new Medico({
        usuario: uid,
        ...req.body
    });
    try {
        const medicoDB = await medico.save();
        return res.json({
            ok: true,
            medico: medicoDB
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado, hable con el administrador'
        })
    }
}

const actualizarMedico = async(req, res = response) => {
    const id = req.params.id;
    const uid = req.uid;
    const hospitalId = req.body.hospital

    try {
        const medico = await Medico.findById(id);
        const hospital = await Hospital.findById(hospitalId);
        if (!medico) {
            return res.status(404).json({
                ok: false,
                msg: 'Médico no econtrado por id'
            })
        }
        if (!hospital) {
            return res.status(404).json({
                ok: false,
                msg: 'Hospital no econtrado por id'
            })
        }
        const cambiosMedico = {
            ...req.body,
            usuario: uid
        }

        const medicoActualizado = await Medico.findByIdAndUpdate(id, cambiosMedico, { new: true });

        res.json({
            ok: true,
            hospital: medicoActualizado
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

const borrarMedico = async(req, res = response) => {
    const id = req.params.id;

    try {
        const medico = await Medico.findById(id);
        if (!medico) {
            return res.status(404).json({
                ok: false,
                msg: 'Médico no econtrado por id'
            })
        }
        await Medico.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Médico borrado'
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
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico,
    getMedicoById
}