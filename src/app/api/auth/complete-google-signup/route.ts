import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Company from "@/models/Company";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route";
import { getToken } from "next-auth/jwt";
import { SignJWT } from "jose";

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

  // ✅ Refresh JWT manually
  const token = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET });
  const newJwt = await new SignJWT({
    ...token,
    companyId: user.companyId.toString(),
    status: "active",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(new TextEncoder().encode(process.env.NEXTAUTH_SECRET!));

  const res = NextResponse.json({ success: true });

  res.cookies.set(
    process.env.NODE_ENV === "production"
      ? "__Secure-next-auth.session-token"
      : "next-auth.session-token",
    newJwt,
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    }
  );

  return res;
}
