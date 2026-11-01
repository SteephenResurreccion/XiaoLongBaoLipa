import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isDemo } from "@/lib/demo";

export async function GET() {
  if (isDemo()) return NextResponse.json([]);
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
