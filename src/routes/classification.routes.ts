import express from "express";
import { classificationService } from "../domain/services/classification.service";
import { isAuth } from "../utils/auth.middleware";

// Router propio de usuarios
export const classificationRouter = express.Router();

classificationRouter.get("/", isAuth, classificationService.getClassifications);
classificationRouter.get("/:id", isAuth, classificationService.getClassificationById);
classificationRouter.delete("/:id", isAuth, classificationService.deleteClassification);
classificationRouter.put("/:id", isAuth, classificationService.updateClassification);
