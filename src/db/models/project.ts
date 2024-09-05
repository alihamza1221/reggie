import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { ProjectType } from "@/lib/ProjectTags";
import { Upvote, upvoteSchema } from "./upvotes";

interface Project extends Document {
  id: string;
  tags: [ProjectType];
  title: string;
  description: string;
  url?: string;
  image?: string;
  active: boolean;
  createdAt: Date;
  eventId: string;
  upVotes: Upvote[];
  teamId: string;
}

// schema
const projectSchema = new Schema<Project>({
  id: { type: String, required: true, default: uuidv4 },
  tags: [{ type: String, default: ["others"] }],
  description: { type: String, default: "" },
  title: { type: String, required: true, default: "" },
  url: { type: String, default: "" },
  image: { type: String, default: "" },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },

  upVotes: [{ type: upvoteSchema, default: [] }],
  eventId: { type: String, required: true, ref: "Event" },
  teamId: { type: String, required: true, ref: "Teams", unique: true },
});

export const ProjectModel =
  (mongoose.models.Project as mongoose.Model<Project>) ||
  mongoose.model<Project>("Project", projectSchema);
