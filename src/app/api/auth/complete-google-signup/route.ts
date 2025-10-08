import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Company from "@/models/Company";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route";

export async function POST(req: Request) {
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { companyName } = await req.json();
  if (!companyName) {
    return NextResponse.json({ error: "Company name is required" }, { status: 400 });
  }

  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // ✅ If user already has a company but status is pending, mark as active
  if (user.companyId && user.status !== "active") {
    user.status = "active";
    await user.save();

    return NextResponse.json({
      success: true,
      message: "User already had a company; status set to active",
    });
  }

  // ✅ Otherwise, create new company and activate
  const company = await Company.create({ name: companyName, active: true });
  user.companyId = company._id;
  user.status = "active";
  await user.save();

  // ✅ Return success — let client refresh session
  return NextResponse.json({ success: true });
}
