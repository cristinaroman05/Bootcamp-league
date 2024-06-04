import express, { type NextFunction, type Response, type Request, type ErrorRequestHandler } from "express";
import { mongoConnect } from "../domain/repositories/mongo-repository";
import { userRouter } from "./user.routes";
import { teamRouter } from "./team.routes";
import { matchRouter } from "./match.routes";


export const configureRoutes = (app: any): any => {
  // Rutas
  const router = express.Router();

  // Middleware de conexión a Mongo
  app.use(async (req: Request, res: Response, next: NextFunction) => {
    await mongoConnect();
    next();
  });

  router.get("/", (req: Request, res: Response) => {
    res.send(`
      <h3>Esta es la RAIZ de nuestra API.</h3>
    `);
  });

  router.get("*", (req: Request, res: Response) => {
    res.status(404).send("Lo sentimos :( No hemos encontrado la página solicitada.");
  });

  // Usamos las rutas
  app.use("/public", express.static("public"));
  app.use("/user", userRouter);
  app.use("/team", teamRouter);
  app.use("/match", matchRouter);
  app.use("/", router);

  return app;
};
