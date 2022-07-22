import Ficha from "../models/Ficha.js";
import Paciente from "../models/Paciente.js";

const agregarFicha = async (req, res) => {
    const {paciente} = req.body;//se extrae al paciente del body

    //ahora se identifica si ese paciente existe
    const existePaciente = await Paciente.findById(paciente);
    if(!existePaciente){
        const error = new Error('El Estudiante no existe');
        return res.status(404).json({msg: error.message});
    }

    //válida los permisos para modificar ficha
   /*  if(existePaciente.creador.toString() !== req.usuario._id.toString() ){
        const error = new Error('No tienes los permisos para añadir Observaciones');
        return res.status(403).json({msg: error.message});
    } */

    
    

    try {
        const fichaAlmacenada = await Ficha.create(req.body);
        //guardar id
        existePaciente.fichas.push(fichaAlmacenada._id);
        await existePaciente.save();
        res.json(fichaAlmacenada);
    } catch (error) {
        console.log(error);
    }
};

const obtenerFicha = async (req, res) => {
    const {id} = req.params;

    const ficha = await Ficha.findById(id).populate("paciente");//cruza la ficha con el paciente y trae a ambos documentos
    
    if(!ficha){
        const error = new Error('Ficha no encontrada');
        return res.status(404).json({msg: error.message});//404 sig no encontrado
    }

    //verifica si el usuario tiene los permisos
    if(ficha.paciente.creador.toString() !== req.usuario._id.toString()){
        const error = new Error('Acción no válida');
        return res.status(403).json({msg: error.message});//403 sin permisos
    }

    res.json(ficha);
};

const actualizarFicha = async (req, res) => {
    const {id} = req.params;

    const ficha = await Ficha.findById(id).populate("paciente");
    
    if(!ficha){
        const error = new Error('Ficha no encontrada');
        return res.status(404).json({msg: error.message});
    }

    
    if(ficha.paciente.creador.toString() !== req.usuario._id.toString()){
        const error = new Error('Acción no válida');
        return res.status(403).json({msg: error.message});
    }

    
    ficha.observaciones = req.body.observaciones || ficha.observaciones;

    try {
        const fichaAlmacenada = await ficha.save();
        res.json(fichaAlmacenada);    
    } catch (error) {
        console.log(error);
    }
};

const eliminarFicha = async (req, res) => {
    const {id} = req.params;

    const ficha = await Ficha.findById(id).populate("paciente");
    
    if(!ficha){
        const error = new Error('Ficha no encontrada');
        return res.status(404).json({msg: error.message});
    }

    
    if(ficha.paciente.creador.toString() !== req.usuario._id.toString()){
        const error = new Error('Acción no válida');
        return res.status(403).json({msg: error.message});
    }

    try {
        const paciente = await Paciente.findById(ficha.paciente);
        paciente.fichas.pull(ficha._id);

        await Promise.allSettled([await paciente.save(), await ficha.deleteOne()]);

        res.json({msg: "Ficha Eliminada"})
    } catch (error) {
        console.log(error);
    }
};

const cambairEstado = async (req, res) => {};

export {
    agregarFicha,
    obtenerFicha,
    actualizarFicha,
    eliminarFicha,
    cambairEstado
};