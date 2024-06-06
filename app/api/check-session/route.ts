// app/api/check-session/route.ts
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  const session = await getServerSession({ req, ...authOptions });

  if (!session) {
    return new NextResponse(null, { status: 401 });
  }

  return new NextResponse(JSON.stringify(session), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
