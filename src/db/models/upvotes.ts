import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

interface Upvote extends Document {
  id: string;
  userId: string;
  projectId: string;
}

const upvoteSchema: Schema<Upvote> = new Schema({
  id: { type: String, required: true, unique: true, default: uuidv4 },
  userId: { type: String, required: true, ref: "User", unique: true },
  projectId: { type: String, required: true, ref: "Project", unique: true },
});

export { upvoteSchema };
export type { Upvote };
