import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  console.log("🔎 DEBUG LOG FROM FRONTEND:", body); // this shows in your terminal
  return NextResponse.json({ ok: true });
}
