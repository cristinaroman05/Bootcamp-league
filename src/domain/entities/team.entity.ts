import { Document, Schema, model } from "mongoose";

export interface ITeamCreate {
  name: string;
  alias: string;
  logo: string;
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
    maxlength: [3, "El alias del equipo debe tener máximo 3 letras"]
  },
  logo: {
    type: String,
    trim: true,
    required: true,
  },
}, {
  timestamps: true,
});

export const Team = model<ITeamCreate>("Team", teamSchema);
