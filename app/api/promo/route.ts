import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { DEMO_PROMO, isDemo } from "@/lib/demo";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ valid: false, error: "No code provided" });
  }

  if (isDemo()) {
    if (code.toUpperCase() !== DEMO_PROMO.code) {
      return NextResponse.json({ valid: false, error: `Invalid code. In the demo, try ${DEMO_PROMO.code}.` });
    }
    const { discountType, discountValue, partnerName } = DEMO_PROMO;
    return NextResponse.json({ valid: true, discountType, discountValue, partnerName });
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
