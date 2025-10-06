import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Auto-activate if company exists
    if (user.companyId && user.status !== "active") {
      user.status = "active";
      await user.save();
    }

    return Response.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Error in /api/auth/user:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
