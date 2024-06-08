import { Document, Schema, model } from "mongoose";
import { IUser, User } from "./user.entity";
import isURL from "validator/lib/isURL";

export interface ITeamCreate {
  name: string;
  alias: string;
  logo?: string;
  players?: IUser[];
}

export type ITeam = ITeamCreate & Document;

const teamSchema = new Schema<ITeamCreate>({
  name: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    minlength: [3, "El nombre del equipo ebe tener al menos 3 caracteres"]
  },
  alias: {
    type: String,
    trim: true,
    required: true,
    maxlength: [20, "El alias del equipo debe tener máximo 20 letras"]
  },
  logo: {
    type: String,
    trim: true,
    required: false,
  },
  players: {
    type: Schema.Types.ObjectId,
    ref: "User",
    trim: true,
    required: false,
  },
}, {
  timestamps: true,
});

export const Team = model<ITeamCreate>("Team", teamSchema);
