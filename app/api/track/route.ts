import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");

  if (!q || q.trim().length < 3) {
    return NextResponse.json(
      { error: "Please enter a mobile number or order reference" },
      { status: 400 }
    );
  }

  try {
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { mobileNumber: q.trim() },
          { orderRef: q.trim().toUpperCase() },
        ],
      },
      orderBy: { createdAt: "desc" },
    });

    if (!order) {
      return NextResponse.json(
        { error: "No order found with that mobile number or reference" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      orderRef: order.orderRef,
      customerName: order.customerName,
      status: order.status,
      items: JSON.parse(order.items),
      subtotal: order.subtotal,
      discount: order.discount,
      deliveryFee: order.deliveryFee,
      total: order.total,
      remainingBalance: order.remainingBalance,
      deliveryMethod: order.deliveryMethod,
      deliveryAddress: order.deliveryAddress,
      scheduledDate: order.scheduledDate,
      timeSlot: order.timeSlot,
      createdAt: order.createdAt,
    });
  } catch (error) {
    console.error("Track order error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve order" },
      { status: 500 }
    );
  }
}
