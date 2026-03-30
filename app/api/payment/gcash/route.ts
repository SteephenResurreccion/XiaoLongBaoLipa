import { NextRequest, NextResponse } from "next/server";
import { createPaymentLink } from "@/lib/paymongo";
import prisma from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  orderId: z.string(),
  amount: z.number().positive(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, amount } = schema.parse(body);

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const { checkoutUrl, paymentIntentId } = await createPaymentLink(
      amount,
      `Xiao Long Bow reservation — ${order.orderRef}`,
      orderId
    );

    await prisma.order.update({
      where: { id: orderId },
      data: { paymentIntentId },
    });

    return NextResponse.json({ checkoutUrl });
  } catch (error) {
    console.error("GCash payment error:", error);
    return NextResponse.json(
      { error: "Failed to create GCash payment link" },
      { status: 500 }
    );
  }
}
