import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { sendSMS } from "@/lib/semaphore";

const schema = z.object({
  name: z.string().min(2),
  mobile: z.string().regex(/^09\d{9}$/),
  email: z.string().email(),
  address: z.string().min(10),
  platform: z.string().min(2),
  followers: z.string().optional(),
  reason: z.string().min(20),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = schema.parse(body);

    await prisma.commissionerApplication.create({ data });

    const ownerMsg =
      `New Commissioner Application from ${data.name} (${data.mobile}). ` +
      `Platform: ${data.platform}. Followers: ${data.followers || "N/A"}. ` +
      `Email: ${data.email}.`;

    const ownerMobile = process.env.OWNER_MOBILE_NUMBER;
    if (ownerMobile) {
      await sendSMS(ownerMobile, ownerMsg).catch((e) =>
        console.error("Commissioner SMS failed:", e)
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Commissioner application error:", error);
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
