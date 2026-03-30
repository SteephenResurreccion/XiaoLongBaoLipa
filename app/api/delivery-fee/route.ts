import { NextRequest, NextResponse } from "next/server";
import { getDeliveryFee } from "@/lib/lalamove";
import { z } from "zod";

const schema = z.object({
  dropLat: z.number(),
  dropLng: z.number(),
  dropAddress: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { dropLat, dropLng, dropAddress } = schema.parse(body);

    const result = await getDeliveryFee(dropLat, dropLng, dropAddress);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Delivery fee error:", error);
    return NextResponse.json(
      { fee: 0, available: false, error: "Failed to calculate delivery fee" },
      { status: 200 }
    );
  }
}
