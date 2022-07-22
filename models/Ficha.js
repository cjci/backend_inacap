import mongoose from "mongoose";

const fichaSchema = mongoose.Schema({
    observaciones: {
        type: String,
        trim: true,
        required: true,
    },
    estado: {
        type: Boolean,
        default: false
    },
    paciente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Paciente",
    }
},
{
    timestamps: true
}); 

const Ficha = mongoose.model("Ficha", fichaSchema);

export default Ficha;