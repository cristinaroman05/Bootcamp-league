import { Document, Schema, model } from "mongoose";
import { ITeam, Team } from "./team.entity";

export interface IClassificationCreate {
  team: ITeam;
  points: number;
  matchPlayed: number;
  matchWin: number;
  matchDraw: number;
  matchLost: number;
  goalsScored: number;
  goalsAgainst: number;
}

export type IClassification = IClassificationCreate & Document;

const classificationSchema = new Schema<IClassificationCreate>({
  team: {
    type: Schema.Types.ObjectId,
    ref: Team,
    trim: true,
    required: true,
  },
  points: {
    type: Number,
    trim: true,
    required: true,
  },
  matchPlayed: {
    type: Number,
    trim: true,
    required: true,
  },
  matchWin: {
    type: Number,
    trim: true,
    required: true,
  },
  matchDraw: {
    type: Number,
    trim: true,
    required: true,
  },
  matchLost: {
    type: Number,
    trim: true,
    required: true,
  },
  goalsScored: {
    type: Number,
    trim: true,
    required: true,
  },
  goalsAgainst: {
    type: Number,
    trim: true,
    required: true
    ,
  },
}, {
  timestamps: true,
});

export const Classification = model<IClassificationCreate>("Classification", classificationSchema);
