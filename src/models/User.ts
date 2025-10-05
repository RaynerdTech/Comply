// models/User.ts
import mongoose, { Schema, Document } from "mongoose";

export type Role = "owner" | "hr" | "employee";

export interface IUser extends Document {
  email: string;
  name?: string;
  password?: string;
  companyId?: mongoose.Types.ObjectId;
  role: Role;
  status: "pending" | "active";
  verifyToken?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, index: true },
  name: { type: String },
  password: { type: String },
  companyId: { type: Schema.Types.ObjectId, ref: "Company", required: false, default: null },
  role: { type: String, enum: ["owner","hr","employee"], required: true },
  status: { type: String, enum: ["pending","active"], default: "pending" },
  verifyToken: { type: String, default: null },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
