import { Match, IMatch, IMatchCreate } from "../entities/match.entity";
import { Document } from "mongoose";

const getAllMatches = async (): Promise<IMatch[]> => {
  return await Match.find()
    .populate(["localTeam", "awayTeam"]);
};

const getMatchCount = async (): Promise<number> => {
  return await Match.countDocuments();
};

const getMatchById = async (id: string): Promise<Document<IMatch> | any> => {
  return await Match.findById(id).populate(["localTeam", "awayTeam"]);
};

const createMatch = async (matchData: IMatchCreate): Promise<Document<IMatch>> => {
  const match = new Match(matchData);
  const document: Document<IMatch> = (await match.save()) as any;

  return document
};

const deleteMatch = async (id: string): Promise<Document<IMatch> | null> => {
  return await Match.findByIdAndDelete(id);
};

const updateMatch = async (id: string, matchData: IMatchCreate): Promise<Document<IMatch> | null> => {
  return await Match.findByIdAndUpdate(id, matchData, { new: true, runValidators: true });
};

export const matchOdm = {
  getAllMatches,
  getMatchCount,
  getMatchById,
  createMatch,
  deleteMatch,
  updateMatch,
};
