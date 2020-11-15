const fs = require('fs');
const Usuario = require('../models/usuarios.model');
const Medico = require('../models/medico.model');
const Hospital = require('../models/hospital.model');


const borrarImagen = (pathViejo) => {
    if (fs.existsSync(pathViejo)) {
        // Borrar imagen anterior
        fs.unlinkSync(pathViejo);
    }
}

const actualizarImagen = async(tipo, id, nombreArchivo) => {
    let pathViejo = '';
    switch (tipo) {
        case 'medicos':
            const medico = await Medico.findById(id);
            if (!medico) {
                return false;
            }

            pathViejo = `./uploads/medicos/${ medico.img }`;
            borrarImagen(pathViejo);

            medico.img = nombreArchivo;
            await medico.save()
            return true;

        case 'hospitales':
            const hospital = await Hospital.findById(id);
            if (!hospital) {
                return false;
            }

            pathViejo = `./uploads/hospitales/${ hospital.img }`;
            borrarImagen(pathViejo);

            hospital.img = nombreArchivo;
            await hospital.save()
            return true;

        case 'usuarios':
            const usuario = await Usuario.findById(id);
            if (!usuario) {
                return false;
            }

            pathViejo = `./uploads/usuarios/${ usuario.img }`;
            borrarImagen(pathViejo);

            usuario.img = nombreArchivo;
            await usuario.save()
            return true;

        default:
            break;
    }

}

module.exports = {
    actualizarImagen
}