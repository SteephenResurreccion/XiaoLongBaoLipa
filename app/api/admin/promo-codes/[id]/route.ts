import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";

const schema = z.object({
  isActive: z.boolean().optional(),
  discountValue: z.number().positive().optional(),
  discountType: z.enum(["fixed", "percentage"]).optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const { id } = await params;
    const body = await request.json();
    const data = schema.parse(body);

    const code = await prisma.promoCode.update({ where: { id }, data });
    return NextResponse.json(code);
  } catch (err) {
    console.error("Update promo code error:", err);
    return NextResponse.json({ error: "Failed to update promo code" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const { id } = await params;
    await prisma.promoCode.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete promo code error:", err);
    return NextResponse.json({ error: "Failed to delete promo code" }, { status: 500 });
  }
}
