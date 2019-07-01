const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cursoSchema = new Schema({
    nombre_curso: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true,
    },
    valor: {
        type: Number,
        required: true,
    },
    modalidad: {
        type: String,
        required: false,
    },
    intensidad: {
        type: Number,
        required: false,
    },
    estado: {
        type: String,
        required: true,
    },
    docente: {
        type: Number,
        required: false,
    }
});

const Curso = mongoose.model('Curso', cursoSchema);

module.exports = Curso; 