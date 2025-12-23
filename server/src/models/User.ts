import { Schema, model, Document } from "mongoose"

export interface IUser extends Document {
  name: string
  email: string
  password: string
  role: string
}

const userSchema = new Schema<IUser>(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: "user" }
  },
  { timestamps: true }
)

export default model<IUser>("User", userSchema, "user")
