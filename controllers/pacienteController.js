/* import Ficha from "../models/Ficha.js"; */
import Paciente from "../models/Paciente.js";
import Usuario from "../models/Usuario.js";

const obtenerPacientes = async (req, res) => {

    const pacientes = await Paciente.find({
        $or: [
            {colaboradores: {$in: req.usuario}},
            {creador: {$in: req.usuario}},
        ],
    })
    .select("-fichas");//find trae todos los pacientes del modelo Paciente

    res.json(pacientes);
};

const nuevoPaciente = async (req, res) => {

    const paciente = new Paciente(req.body);
    paciente.creador = req.usuario._id;//se crea el nuevo paciente junto con el creador

    try {
        const pacienteAlmacenado = await paciente.save();
        res.json(pacienteAlmacenado);
    } catch (error) {
        console.log(error);
    }
};

const obtenerPaciente = async (req, res) => {
    const { id } = req.params;

    const paciente = await Paciente.findById(id).populate("fichas").populate("colaboradores", "nombre email");//se busca al pacinete por la id de la base de datos

    if (!paciente) {
        const error = new Error("No Encontrado");
        return res.status(404).json({ msg: error.message });
    }

    if (paciente.creador.toString() !== req.usuario._id.toString() && !paciente.
    colaboradores.some(colaborador => colaborador._id.toString() === req.usuario._id.toString() )) {
        const error = new Error("Acción no Válida");
        return res.status(401).json({ msg: error.message });
    }//válida al paciente con el creador

    //obtener las fichas del paciente

    res.json(
        paciente,
    );

};

const editarPaciente = async (req, res) => {
    const { id } = req.params;

    const paciente = await Paciente.findById(id);//se busca al pacinete por la id de la base de datos

    if (!paciente) {
        const error = new Error("No Encontrado");
        return res.status(404).json({ msg: error.message });
    }

    if (paciente.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Acción no Válida");
        return res.status(401).json({ msg: error.message });
    }

    paciente.nombre = req.body.nombre || paciente.nombre;
    //solicitud de cambio                 mantine lo ahí en la base de datos
    paciente.apellidos = req.body.apellidos || paciente.apellidos;
    paciente.rut = req.body.rut || paciente.rut;
    paciente.carrera = req.body.carrera || paciente.carrera;
    paciente.email = req.body.email || paciente.email;
    paciente.celular = req.body.celular || paciente.celular;
    paciente.descripcion = req.body.descripcion || paciente.descripcion;

    try {
        const pacienteAlmacenado = await paciente.save();
        res.json(pacienteAlmacenado);
    } catch (error) {
        console.log(error);
    }
};

const eliminarPaciente = async (req, res) => {
    const { id } = req.params;

    const paciente = await Paciente.findById(id);//se busca al pacinete por la id de la base de datos

    if (!paciente) {
        const error = new Error("No Encontrado");
        return res.status(404).json({ msg: error.message });
    }

    if (paciente.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Acción no Válida");
        return res.status(401).json({ msg: error.message });
    }

    try {
        await paciente.deleteOne();
        res.json({ msg: "Estudiante Eliminado" })
    } catch (error) {
        console.log(error);
    }
};

const buscarColaborador = async (req, res) => {
    const { email } = req.body

    const usuario = await Usuario.findOne({ email }).select("-confirmado -createdAt -password -token -updatedAt -__v");

    if (!usuario) {
        const error = new Error("Usuario no encontrado");
        return res.status(404).json({ msg: error.message });
    }
    res.json(usuario);
};

const agregarColaborador = async (req, res) => {
    const paciente = await Paciente.findById(req.params.id);

    if (!paciente) {
        const error = new Error("Estudiante no encontrado");
        return res.status(404).json({ msg: error.message })
    }

    if (paciente.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Acción no válida");
        return res.status(404).json({ msg: error.message });
    }

    const { email } = req.body

    const usuario = await Usuario.findOne({ email }).select("-confirmado -createdAt -password -token -updatedAt -__v");

    if (!usuario) {
        const error = new Error("Usuario no encontrado");
        return res.status(404).json({ msg: error.message });
    }

    //verificar si el colaborador es el admin del proyecto
    if (paciente.creador.toString() === usuario._id.toString()) {
        const error = new Error("No es necesario que te agregues como colaborador");
        return res.status(404).json({ msg: error.message });
    }

    //comprobar si ya se agregado como colaborador
    if (paciente.colaboradores.includes(usuario._id)) {
        const error = new Error("El usuarios ya es colaborador");
        return res.status(404).json({ msg: error.message });
    }

    //agregar colaborador
    paciente.colaboradores.push(usuario._id);
    await paciente.save();
    res.json({ msg: "Colaborador Agregado Correctamente" });
};

const eliminarColaborador = async (req, res) => {

    const paciente = await Paciente.findById(req.params.id);

    if (!paciente) {
        const error = new Error("Estudiante no encontrado");
        return res.status(404).json({ msg: error.message })
    }

    if (paciente.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Acción no válida");
        return res.status(404).json({ msg: error.message });
    }

    //eliminar colaborador
    paciente.colaboradores.pull(req.body.id);

    await paciente.save();
    res.json({ msg: "Colaborador Eliminado Correctamente" });
};

/* const obtenerTareas = async (req, res) => { 
    const {id} = req.params;

    const existePaciente = await Paciente.findById(id);
    if(!existePaciente){
        const error = new Error("No encontrado");
        return res.status(404).json({msg: error.message});
    }
    //para obtener al paciente debes ser el creador o colaborador

    const fichas = await Ficha.find().where('paciente').equals(id);
    res.json(fichas);
}; */

export {
    obtenerPacientes,
    nuevoPaciente,
    obtenerPaciente,
    editarPaciente,
    eliminarPaciente,
    buscarColaborador,
    agregarColaborador,
    eliminarColaborador,

};