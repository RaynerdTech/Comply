// app/api/auth/signup/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Company from "@/models/Company";
import User from "@/models/User";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/sendEmail";

export async function POST(req: Request) {
  const { companyName, email, password, name } = await req.json();
  if (!companyName || !email || !password) {
    return NextResponse.json({ error: "companyName, email and password required" }, { status: 400 });
  }

  await connectDB();

  // ensure email not used as an owner already
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ error: "Email already in use" }, { status: 409 });
  }

  // create company (inactive until verification)
  const company = await Company.create({ name: companyName, active: false });

  const hashed = await bcrypt.hash(password, 10);
  const token = crypto.randomBytes(32).toString("hex");

  const user = await User.create({
    email,
    name,
    password: hashed,
    companyId: company._id,
    role: "owner",
    status: "pending",
    verifyToken: token,
  });

  // send verification email
  try {
    await sendVerificationEmail(email, token);
  } catch (err) {
    // cleanup on failure
    await User.deleteOne({ _id: user._id });
    await Company.deleteOne({ _id: company._id });
    return NextResponse.json({ error: "Failed to send verification email" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, message: "Verification email sent" });
}
