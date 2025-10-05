// app/api/auth/verify/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Company from "@/models/Company";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  if (!token) return NextResponse.json({ error: "token missing" }, { status: 400 });

  await connectDB();

  const user = await User.findOne({ verifyToken: token });
  if (!user) return NextResponse.json({ error: "Invalid or expired token" }, { status: 404 });

  user.status = "active";
  user.verifyToken = null;
  await user.save();

  // activate company
  await Company.findByIdAndUpdate(user.companyId, { active: true });

  // redirect to login page (client will show success)
  const redirectUrl = `${process.env.NEXTAUTH_URL}/login?verified=1`;
  return NextResponse.redirect(redirectUrl);
}
