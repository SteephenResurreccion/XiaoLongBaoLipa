import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";
import { sendSMS } from "@/lib/semaphore";
import { formatPrice } from "@/lib/utils";

const schema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "DELIVERED"]),
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
    const { status } = schema.parse(body);

    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });

    // Send SMS to customer when order is confirmed
    if (status === "CONFIRMED") {
      const customerMsg =
        `Hi ${order.customerName}! Your Xiao Long Bow order [${order.orderRef}] is CONFIRMED! ` +
        `Remaining balance: ${formatPrice(order.remainingBalance)} to be paid on ` +
        `${order.deliveryMethod === "delivery" ? "delivery" : "pickup"}. ` +
        `Date: ${order.scheduledDate}, ${order.timeSlot}. Thank you!`;

      await sendSMS(order.mobileNumber, customerMsg).catch((e) =>
        console.error("Customer SMS failed:", e)
      );
    }

    return NextResponse.json({ ...order, items: JSON.parse(order.items) });
  } catch (err) {
    console.error("Order update error:", err);
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
