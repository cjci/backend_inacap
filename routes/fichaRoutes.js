import express from "express";

import {
    agregarFicha,
    obtenerFicha,
    actualizarFicha,
    eliminarFicha,
    cambairEstado
} from "../controllers/fichaControllers.js";

import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.post("/", checkAuth, agregarFicha);
router
    .route("/:id")
    .get(checkAuth, obtenerFicha)
    .put(checkAuth, actualizarFicha)
    .delete(checkAuth, eliminarFicha);

router.post("/estado/:id", checkAuth, cambairEstado);

export default router;