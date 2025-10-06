import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Company from "@/models/Company";
import User from "@/models/User";

export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const company = await Company.findById(user.companyId);
  return NextResponse.json({ company });
}
