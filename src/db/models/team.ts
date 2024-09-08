import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

interface Team extends Document {
  id: string;
  name: string;
  image: string;
  members: [string];
}

const teamSchema: Schema<Team> = new Schema<Team>({
  id: { type: String, required: true, default: uuidv4, unique: true },
  name: {
    type: String,
    required: true,
    default: "rankit default",
    unique: true,
  },
  image: {
    type: String,
    default:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTu9s06DiCw2vcK8LCV68dnZU8-A1cyl5U2FA&s",
  },
  members: [{ type: String, ref: "User" }],
});

export const teamModel =
  (mongoose.models.Team as mongoose.Model<Team>) ||
  mongoose.model<Team>("Team", teamSchema);

export type { Team };
export { teamSchema };
