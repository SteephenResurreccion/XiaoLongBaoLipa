import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";

export async function GET() {
  const { error } = await requireAdminSession();
  if (error) return error;

  const [resellers, commissioners] = await Promise.all([
    prisma.resellerApplication.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.commissionerApplication.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  return NextResponse.json({ resellers, commissioners });
}
