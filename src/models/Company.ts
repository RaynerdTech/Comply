// models/Company.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ICompany extends Document {
  name: string;
  plan: "free" | "pro" | "advanced";
  active: boolean;
  stripeCustomerId?: string; // unused for now; note: we'll use Paystack later
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema = new Schema<ICompany>({
  name: { type: String, required: true },
  plan: { type: String, enum: ["free", "pro", "advanced"], default: "free" },
  active: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Company || mongoose.model<ICompany>("Company", CompanySchema);