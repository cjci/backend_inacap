import mongoose from 'mongoose';
import bcrypt from "bcrypt";

//estructura de la base de datos
const usuarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },

    password: {
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

    token: {
        type: String,
    },

    confirmado: {
        type: Boolean,
        default: false,
    },
}, {
    //da dos columnas una de creado y la otra de actualizado
    timestamps: true,
});

//este código se ejecuta antes de guardar los datos en la base de datos
usuarioSchema.pre('save', async function(next){
    //al modificar todo menos el password no se hashea
    if (!this.isModified("password")){
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);//se toman dos parametros el string que se va a hashear y el otro es el salt y luego se almacena en this.password
});

//comprobar contraseña
usuarioSchema.methods.comprobarPassword = async function
(passwordFormulario){
    return await bcrypt.compare(passwordFormulario, this.password);
    
}

const Usuario = mongoose.model("Usuario", usuarioSchema);
export default Usuario;