import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";

const schema = z.object({
  code: z.string().min(3).max(20).toUpperCase(),
  partnerName: z.string().min(2),
  discountType: z.enum(["fixed", "percentage"]),
  discountValue: z.number().positive(),
});

export async function GET() {
  const { error } = await requireAdminSession();
  if (error) return error;

  const codes = await prisma.promoCode.findMany({
    orderBy: { createdAt: "desc" },
    include: { orders: { select: { id: true, orderRef: true } } },
  });
  return NextResponse.json(codes);
}

export async function POST(request: NextRequest) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const body = await request.json();
    const data = schema.parse(body);

    const existing = await prisma.promoCode.findUnique({ where: { code: data.code } });
    if (existing) {
      return NextResponse.json({ error: "Code already exists" }, { status: 400 });
    }

    const code = await prisma.promoCode.create({ data });
    return NextResponse.json(code);
  } catch (err) {
    console.error("Create promo code error:", err);
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid code data", details: err.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create promo code" }, { status: 500 });
  }
}
