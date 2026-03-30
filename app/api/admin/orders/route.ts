import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";

export async function GET() {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      orders.map((o: typeof orders[number]) => ({
        ...o,
        items: JSON.parse(o.items),
      }))
    );
  } catch (err) {
    console.error("Admin orders error:", err);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
