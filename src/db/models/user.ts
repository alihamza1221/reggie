import mongoose, { Schema, Document } from "mongoose";

type Provider = "Google";

interface IUser extends Document {
  id: string;
  name: string;
  email: string;
  image: string;
  provider: Provider;
}

const userSchema: Schema<IUser> = new Schema<IUser>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  provider: { type: String, enum: ["Google"], required: true },
});
export const userModel =
  (mongoose.models.User as mongoose.Model<IUser>) ||
  mongoose.model<IUser>("User", userSchema);

export { userSchema };
export type { IUser };
