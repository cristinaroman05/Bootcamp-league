import express from "express";
import cors from "cors";
import { configureRoutes } from "../routes/index";

// Cargamos variables de entorno
import dotenv from "dotenv";
dotenv.config();



// Configuración del server
export const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "http://localhost:4000",
  })
);

configureRoutes(app);
