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
  ).min(1, "Cart is empty"),
  subtotal: z.number(),
  promoCode: z.string().optional(),
  discount: z.number().default(0),
  deliveryMethod: z.enum(["DELIVERY", "PICKUP"]),
  deliveryAddress: z.string().optional(),
  deliveryFee: z.number().default(0),
  total: z.number(),
  remainingBalance: z.number(),
  paymentMethod: z.enum(["GCASH", "CARD"]),
  orderNotes: z.string().optional(),
  scheduledDate: z.string(),
  timeSlot: z.string(),
}).superRefine((data, ctx) => {
  if (data.deliveryMethod === "DELIVERY" && (!data.deliveryAddress || data.deliveryAddress.trim().length < 5)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Delivery address is required",
      path: ["deliveryAddress"],
    });
  }
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = orderSchema.parse(body);

    // Enforce: scheduled date must not be blocked
    const blockedDates = await prisma.blockedDate.findMany({ select: { date: true } });
    const blockedList = blockedDates.map((b) => b.date);
    if (blockedList.includes(data.scheduledDate)) {
      return NextResponse.json(
        { error: "The selected date is unavailable. Please choose another date." },
        { status: 400 }
      );
    }

    // Re-validate promo code server-side
    let serverDiscount = 0;
    if (data.promoCode) {
      const promo = await prisma.promoCode.findUnique({
        where: { code: data.promoCode.toUpperCase() },
      });
      if (!promo || !promo.isActive) {
        return NextResponse.json(
          { error: "Promo code is invalid or has expired." },
          { status: 400 }
        );
      }
      serverDiscount = promo.discountType === "fixed"
        ? promo.discountValue
        : Math.floor((data.subtotal * promo.discountValue) / 100);
    }

    // Use server-calculated discount to prevent tampering
    const discount = data.promoCode ? serverDiscount : 0;
    const deliveryFee = data.deliveryMethod === "DELIVERY" ? data.deliveryFee : 0;
    const total = data.subtotal - discount + deliveryFee;

    const orderRef = generateOrderRef();

    const order = await prisma.order.create({
      data: {
        orderRef,
        customerName: data.customerName,
        mobileNumber: data.mobileNumber,
        items: JSON.stringify(data.items),
        subtotal: data.subtotal,
        promoCode: data.promoCode || null,
        discount,
        reservationFee: 0,
        deliveryMethod: data.deliveryMethod,
        deliveryAddress: data.deliveryAddress || null,
        deliveryFee,
        total,
        remainingBalance: 0,
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
      `Items: ${itemsSummary}. Total: ${formatPrice(total)}. ` +
      `${data.deliveryMethod === "DELIVERY" ? `Delivery to: ${data.deliveryAddress}` : "Pickup"}. ` +
      `Date: ${data.scheduledDate} ${data.timeSlot}. Pay: ${data.paymentMethod}.`;

    const ownerMobile = process.env.OWNER_MOBILE_NUMBER;
    if (ownerMobile) {
      sendSMS(ownerMobile, ownerMsg).catch((e) =>
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
