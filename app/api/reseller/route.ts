import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { sendSMS } from "@/lib/semaphore";

const schema = z.object({
  name: z.string().min(2),
  mobile: z.string().regex(/^09\d{9}$/),
  email: z.string().email(),
  address: z.string().min(10),
  reason: z.string().min(20),
  experience: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = schema.parse(body);

    await prisma.resellerApplication.create({ data });

    const ownerMsg =
      `New Reseller Application from ${data.name} (${data.mobile}). ` +
      `Email: ${data.email}. Address: ${data.address}. ` +
      `Reason: ${data.reason.substring(0, 50)}...`;

    const ownerMobile = process.env.OWNER_MOBILE_NUMBER;
    if (ownerMobile) {
      await sendSMS(ownerMobile, ownerMsg).catch((e) =>
        console.error("Reseller SMS failed:", e)
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reseller application error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid form data", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}
