import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import conectarBD from "./config/db.js";
import router from "./routes/usuarioRoutes.js";
import pacienteRoutes from "./routes/pacienteRoutes.js";
import fichaRoutes from "./routes/fichaRoutes.js";

const app = express();
app.use(express.json());//habilita la lectura de json correctamente

dotenv.config();

conectarBD();

//configuración del cors
const whitelist = [process.env.FRONTEND_URL];

const corsOptions = {
    origin: function (origin, callback) {

        if (whitelist.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Error de localhost"));
        }
    }
};

app.use(cors(corsOptions));

app.use(cors({
    'allowedHeaders': ['Content-Type'],
    'origin': '*',
    'preflightContinue': true
}));


//Routing
app.use("/api/usuarios", router);
app.use("/api/pacientes", pacienteRoutes);
app.use("/api/fichas", fichaRoutes);



/* variable de entorno para el puerto
lo que hace esta variable cuando se mande a producción se ira al PORT,
y si esta en local se ira al puerto 4000 */
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`servidor corriendo en el puerto ${PORT}`)
});