import mongoose from 'mongoose';

const pacientesSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    apellidos: {
        type: String,
        required: true,
        trim: true
    },
    rut: {
        type: String,
        required: true,
        trim: true
    },
    carrera: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    celular: {
        type: String,
        required: true,
        trim: true
    },
    descripcion: {
        type: String,
        required: true,
        trim: true
    },
    creador: {
        type: mongoose.Schema.Types.ObjectId,//relaciona los pacientes con los usuarios
        ref: "Usuario",
        
    },
    fichas: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Ficha",
        }
    ],
    colaboradores: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Usuario",
            
        }
    ],//es un arreglo (colección) de muchos objetos

},
{
    timestamps: true,
} 
);

const Paciente = mongoose.model("Paciente", pacientesSchema);

export default Paciente;