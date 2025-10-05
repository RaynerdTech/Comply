import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

type LeanUser = {
  _id: string;
  email: string;
  name?: string;
  role?: string;
  companyId?: string;
  status?: string;
};

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ user: null });
  }

  await connectDB();

  // explicitly cast the returned value so TS knows what fields exist
  const user = (await User.findOne({ email: session.user.email }).lean()) as LeanUser | null;

  if (!user) return NextResponse.json({ user: null });

  const safe = {
    id: user._id.toString(),
    email: user.email,
    name: user.name || "",
    role: user.role || "user",
    companyId: user.companyId || null,
    status: user.status || "pending",
  };

  return NextResponse.json({ user: safe });
}
