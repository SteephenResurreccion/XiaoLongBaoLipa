import { NextRequest, NextResponse } from "next/server";
import { createPaymentIntent } from "@/lib/stripe";
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

    const { clientSecret, paymentIntentId } = await createPaymentIntent(
      amount,
      "php",
      orderId
    );

    await prisma.order.update({
      where: { id: orderId },
      data: { paymentIntentId },
    });

    return NextResponse.json({ clientSecret });
  } catch (error) {
    console.error("Card payment error:", error);
    return NextResponse.json(
      { error: "Failed to create card payment intent" },
      { status: 500 }
    );
  }
}
