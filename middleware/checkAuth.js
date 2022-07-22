import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";
/* 
mediente los haedaer se envian los jwt por lo que si los datos estan bien por ese medio
se vàlida al Usuario, Bearer token es un modo de autorizaciòn de usuario
 */

const checkAuth = async (req, res, next) => {

    let token;
    if (
        req.headers.authorization && req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);//se decodifica el token
            req.usuario = await Usuario.findById(decoded.id).select("-password -confirmado -token -createdAt -updatedAt -__v");//se busca al usuario por el id entregado por el token decodificado,
            // por otro lado la variable req.usuario se puede usar en cualquier otro lado para identifcar al usuario log
            return next();
        } catch (error) {
            return res.status(404).json({ msg: 'Hubo un error' })//error al comprobar el token o ya expiro
        }
    }

    if (!token) {
        //cuando no hay token
        const error = new Error('Token no válido');
        return res.status(401).json({ msg: error.message });//se le agrega return para que no ejecute el sig middlware del next video 387
    }

    /* next(); */
}

export default checkAuth;