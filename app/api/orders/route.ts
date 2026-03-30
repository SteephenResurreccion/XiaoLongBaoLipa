import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { sendSMS } from "@/lib/semaphore";
import { generateOrderRef, formatPrice } from "@/lib/utils";

const orderSchema = z.object({
  customerName: z.string().min(2),
  mobileNumber: z.string().regex(/^09\d{9}$/),
  items: z.array(
    z.object({
      id: z.string(),
      size: z.string(),
      pieces: z.number(),
      price: z.number(),
      qty: z.number(),
    })
  ),
  subtotal: z.number(),
  promoCode: z.string().optional(),
  discount: z.number().default(0),
  deliveryMethod: z.enum(["delivery", "pickup"]),
  deliveryAddress: z.string().optional(),
  deliveryFee: z.number().default(0),
  total: z.number(),
  remainingBalance: z.number(),
  paymentMethod: z.enum(["gcash", "card"]),
  orderNotes: z.string().optional(),
  scheduledDate: z.string(),
  timeSlot: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = orderSchema.parse(body);

    const orderRef = generateOrderRef();

    const order = await prisma.order.create({
      data: {
        orderRef,
        customerName: data.customerName,
        mobileNumber: data.mobileNumber,
        items: JSON.stringify(data.items),
        subtotal: data.subtotal,
        promoCode: data.promoCode || null,
        discount: data.discount,
        reservationFee: 50,
        deliveryMethod: data.deliveryMethod,
        deliveryAddress: data.deliveryAddress || null,
        deliveryFee: data.deliveryFee,
        total: data.total,
        remainingBalance: data.remainingBalance,
        paymentMethod: data.paymentMethod,
        orderNotes: data.orderNotes || null,
        scheduledDate: data.scheduledDate,
        timeSlot: data.timeSlot,
        status: "PENDING",
      },
    });

    // Send SMS to owner
    const itemsSummary = data.items
      .map((i) => `${i.qty}x ${i.size} (${i.pieces}pcs)`)
      .join(", ");
    const ownerMsg =
      `New Order [${orderRef}] from ${data.customerName} (${data.mobileNumber}). ` +
      `Items: ${itemsSummary}. Total: ${formatPrice(data.total)}. ` +
      `Remaining: ${formatPrice(data.remainingBalance)}. ` +
      `${data.deliveryMethod === "delivery" ? `Delivery to: ${data.deliveryAddress}` : "Pickup"}. ` +
      `Date: ${data.scheduledDate} ${data.timeSlot}.`;

    const ownerMobile = process.env.OWNER_MOBILE_NUMBER;
    if (ownerMobile) {
      await sendSMS(ownerMobile, ownerMsg).catch((e) =>
        console.error("Owner SMS failed:", e)
      );
    }

    return NextResponse.json({ orderId: order.id, orderRef: order.orderRef });
  } catch (error) {
    console.error("Order creation error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid order data", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
