import { Document, Schema, model } from "mongoose";
import { IMatch, Match } from "./match.entity";

export interface IJourneyCreate {
  journeyMatch: IMatch[];
  journeyDate: Date;
  score: String;
}

export type IJourney = IJourneyCreate & Document;

const journeySchema = new Schema<IJourneyCreate>(
  {
    journeyMatch: [
      {
      type: Schema.Types.ObjectId,
      ref: Match,
      trim: true,
      unique: false,
      required: true,
      minlength: [3, "El nombre del equipo debe yener 3 caracteres como máximo"],
    }
  ],
    journeyDate: {
      type: Date,
      trim: true,
      required: true,
    },
    score: {
      type: String,
      trim: true,
      required: false,
    }
  },
  {
    timestamps: true,
  }
);

export const Journey = model<IJourneyCreate>("Journey", journeySchema);