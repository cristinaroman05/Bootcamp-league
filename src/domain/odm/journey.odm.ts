import { Journey, IJourney, IJourneyCreate } from "../entities/journey.entity";
import { Document } from "mongoose";

const getAllJournies = async (): Promise<IJourney[]> => {
  return await Journey.find()
    .populate(["match"]);
};

const getJourneyCount = async (): Promise<number> => {
  return await Journey.countDocuments();
};

const getJourneyById = async (id: string): Promise<Document<IJourney> | any> => {
  return await Journey.findById(id).populate(["match"]);
};

const createJourney = async (JourneyData: IJourneyCreate): Promise<Document<IJourney>> => {
  const journey = new Journey(JourneyData);
  const document: Document<IJourney> = (await journey.save()) as any;

  return document
};

const deleteJourney = async (id: string): Promise<Document<IJourney> | null> => {
  return await Journey.findByIdAndDelete(id);
};

const updateJourney = async (id: string, JourneyData: IJourneyCreate): Promise<Document<IJourney> | null> => {
  return await Journey.findByIdAndUpdate(id, JourneyData, { new: true, runValidators: true });
};

export const JourneyOdm = {
  getAllJournies,
  getJourneyCount,
  getJourneyById,
  createJourney,
  deleteJourney,
  updateJourney,
};