import { Classification, IClassification, IClassificationCreate } from "../entities/classification.entity";
import { Document } from "mongoose";

const getAllClassifications = async (): Promise<IClassification[]> => {
  return await Classification.find().sort({ points: -1 }).populate(["team"]);
};

const getClassificationCount = async (): Promise<number> => {
  return await Classification.countDocuments();
};

const getClassificationById = async (id: string): Promise<Document<IClassification> | any> => {
  return await Classification.findById(id).populate(["team"]);
};
const createClassification = async (classificationData: IClassificationCreate): Promise<Document<IClassification>> => {
  const classification = new Classification(classificationData);
  const document: Document<IClassification> = (await classification.save()) as any;

  return document;
};
const deleteClassification = async (id: string): Promise<Document<IClassification> | null> => {
  return await Classification.findByIdAndDelete(id);
};

const updateClassification = async (id: string, classificationData: IClassificationCreate): Promise<Document<IClassification> | null> => {
  return await Classification.findByIdAndUpdate(id, classificationData, { new: true, runValidators: true });
};

export const classificationOdm = {
  getAllClassifications,
  getClassificationCount,
  getClassificationById,
  createClassification,
  deleteClassification,
  updateClassification
};
