import { Document, Schema, model } from "mongoose";
import { ITeam, Team } from "./team.entity";

export interface IMatchCreate {
  localTeam: ITeam;
  awayTeam: ITeam;
  goalsLocalTeam?: number;
  goalsAwayTeam?: number;
  matchDate: Date;
}

export type IMatch = IMatchCreate & Document;

const matchSchema = new Schema<IMatchCreate>(
  {
    localTeam: {
      type: Schema.Types.ObjectId,
      ref: Team,
      trim: true,
      unique: false,
      minlength: [3, "El nombre del equipo debe yener 3 caracteres como máximo"],
    },
    awayTeam: {
      type: Schema.Types.ObjectId,
      ref: Team,
      trim: true,
      unique: false,
      minlength: [3, "El nombre del equipo debe yener 3 caracteres como máximo"],
    },
    goalsLocalTeam: {
      type: Number,
      trim: true,
      required: false,
    },
    goalsAwayTeam: {
      type: Number,
      trim: true,
      required: false,
    },
    matchDate: {
      type: Date,
      trim: true,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

export const Match = model<IMatchCreate>("Match", matchSchema);
