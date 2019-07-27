const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
    cedula: {
        type: Number,
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    password: {
        type: String,
        require: true
    },
    correo: {
        type: String,
        required: true,
        trim: true
    },
    telefono: {
        type: Number,
        required: true
    },
    tipo: {
        type: String,
        default: "aspirante"
    },
    avatar: {
        type: Buffer
    }
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;