///express nos ayudara a menejar los router
import express from "express";
const router = express.Router();

import { registrar, autenticar, confirmar, olvidePassword, comprobarToken, nuevoPassword, perfil } from '../controllers/usuarioController.js';
import checkAuth from "../middleware/checkAuth.js";

//autenticación, registro y confirmación de usuarios

router.post("/", registrar); //crear nuevo usuario
router.post("/login", autenticar);
router.get("/confirmar/:token", confirmar);//:routing dinámico
router.post("/lost-password", olvidePassword);//recuperar password
/* router.get("/lost-password/:token", comprobarToken);//validacion entre token y usuario para el cambio de conytraseña
router.post("/lost-password/:token", nuevoPassword); */

router.route("/lost-password/:token").get(comprobarToken).post(nuevoPassword);

router.get("/perfil", checkAuth, perfil);

export default router;