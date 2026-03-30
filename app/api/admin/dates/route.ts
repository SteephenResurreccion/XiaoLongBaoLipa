import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";

const schema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  reason: z.string().optional(),
});

export async function GET() {
  const { error } = await requireAdminSession();
  if (error) return error;

  const dates = await prisma.blockedDate.findMany({ orderBy: { date: "asc" } });
  return NextResponse.json(dates);
}

export async function POST(request: NextRequest) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const body = await request.json();
    const { date, reason } = schema.parse(body);

    const blocked = await prisma.blockedDate.upsert({
      where: { date },
      update: { reason: reason || null },
      create: { date, reason: reason || null },
    });

    return NextResponse.json(blocked);
  } catch (err) {
    console.error("Block date error:", err);
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to block date" }, { status: 500 });
  }
}
