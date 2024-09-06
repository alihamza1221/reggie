import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

// event interface
interface IEvent extends Document {
  id: string;
  name: string;
  description: string;
  date: Date | string;
  location: string;
  createdAt: Date;

  TeamsApplied_id: [string];
  TeamsAccepted_id: [string];

  userId: string;
}

// event schema
const eventSchema: Schema<IEvent> = new Schema<IEvent>({
  id: { type: String, required: true, default: uuidv4, unique: true },
  name: { type: String, required: true, default: "rankit default" },
  description: { type: String, required: true, default: "" },
  date: {
    type: Schema.Types.Mixed,
    required: true,
    default: "Will be announced soon...",
  },
  location: { type: String, required: true, default: "Remote" },
  createdAt: { type: Date, required: true, default: Date.now },
  TeamsApplied_id: { type: [String], required: true, default: [], ref: "Team" },
  TeamsAccepted_id: {
    type: [String],
    required: true,
    default: [],
    ref: "Team",
  },

  userId: { type: String, required: true, ref: "User" },
});

// event model
export const eventModel =
  (mongoose.models.Event as mongoose.Model<IEvent>) ||
  mongoose.model<IEvent>("Event", eventSchema);

export type { IEvent };
export { eventSchema };
