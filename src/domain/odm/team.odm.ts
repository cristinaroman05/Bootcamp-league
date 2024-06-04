import { Team, ITeam, ITeamCreate } from "../entities/team.entity";
import { Document } from "mongoose";

const getAllTeams = async (page: number, limit: number): Promise<ITeam[]> => {
  return await Team.find()
    .limit(limit)
    .skip((page - 1) * limit);
};

const getAllNameTeams = async (): Promise<ITeam[]> => {
  return await Team.find({}, { name: 0, _id: 1 }) as any;
};

const getTeamCount = async (): Promise<number> => {
  return await Team.countDocuments();
};

const getTeamById = async (id: string): Promise<Document<ITeam> | null> => {
  return await Team.findById(id);
};

const createTeam = async (teamData: ITeamCreate): Promise<Document<ITeam>> => {
  const team = new Team(teamData);
  const document: Document<ITeam> = (await team.save()) as any;

  return document;
};

const deleteTeam = async (id: string): Promise<Document<ITeam> | null> => {
  return await Team.findByIdAndDelete(id);
};

const updateTeam = async (id: string, teamData: ITeamCreate): Promise<Document<ITeam> | null> => {
  return await Team.findByIdAndUpdate(id, teamData, { new: true, runValidators: true });
};

export const teamOdm = {
  getAllTeams,
  getAllNameTeams,
  getTeamCount,
  getTeamById,
  createTeam,
  deleteTeam,
  updateTeam,
};
