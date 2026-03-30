import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const blocked = await prisma.blockedDate.findMany({
      select: { date: true, reason: true },
    });
    return NextResponse.json(blocked);
  } catch (error) {
    console.error("Blocked dates fetch error:", error);
    return NextResponse.json([], { status: 200 });
  }
}
