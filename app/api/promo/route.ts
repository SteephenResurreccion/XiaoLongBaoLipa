import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ valid: false, error: "No code provided" });
  }

  try {
    const promo = await prisma.promoCode.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!promo || !promo.isActive) {
      return NextResponse.json({ valid: false, error: "Invalid or expired promo code" });
    }

    return NextResponse.json({
      valid: true,
      discountType: promo.discountType,
      discountValue: promo.discountValue,
      partnerName: promo.partnerName,
    });
  } catch (error) {
    console.error("Promo lookup error:", error);
    return NextResponse.json({ valid: false, error: "Failed to validate code" });
  }
}
