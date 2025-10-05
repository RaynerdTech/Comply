import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route";

export async function GET(req: Request) {
  const session = await getServerSession({ req, ...authOptions });
  return NextResponse.json(session);
}
