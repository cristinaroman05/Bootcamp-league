import { Request, Response, NextFunction } from "express";
import { classificationOdm } from "../odm/classification.odm";

export const getClassifications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Only for admins
    if (req.user.rol !== "ADMIN") {
      res.status(401).json({ error: "No tienes autorización para hacer esto" });
      return;
    }

    const classifications = await classificationOdm.getAllClassifications();

    // Num total de elementos
    const totalElements = await classificationOdm.getClassificationCount();

    const response = {
      totalItems: totalElements,
      data: classifications,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const getClassificationById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const classificationIdToShow = req.params.id;

    // Only for admins
    if (req.user.rol !== "ADMIN") {
      res.status(401).json({ error: "No tienes autorización para hacer esto" });
      return;
    }

    const classification = await classificationOdm.getClassificationById(classificationIdToShow);

    if (classification) {
      res.json(classification);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
};

export const deleteClassification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Only for admins
    if (req.user.rol !== "ADMIN") {
      res.status(401).json({ error: "No tienes autorización para hacer esto" });
      return;
    }

    const id = req.params.id;
    const classificationDeleted = await classificationOdm.deleteClassification(id);
    if (classificationDeleted) {
      res.json(classificationDeleted);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
};
export const updateClassification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Only for admins
    if (req.user.rol !== "ADMIN") {
      res.status(401).json({ error: "No tienes autorización para hacer esto" });
      return;
    }

    const id = req.params.id;
    const classificationToUpdate = await classificationOdm.getClassificationById(id);
    if (classificationToUpdate) {
      Object.assign(classificationToUpdate, req.body);
      const classificationSaved = await classificationToUpdate.save();
      res.json(classificationSaved);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
};

export const classificationService = {
  getClassifications,
  getClassificationById,
  deleteClassification,
  updateClassification,
};
