import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ date: string }> }
) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const { date } = await params;
    await prisma.blockedDate.delete({ where: { date } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Unblock date error:", err);
    return NextResponse.json({ error: "Failed to unblock date" }, { status: 500 });
  }
}
