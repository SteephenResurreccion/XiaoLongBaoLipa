import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";

const schema = z.object({
  isOpen: z.boolean().optional(),
  closedMessage: z.string().optional(),
  pickupAddress: z.string().optional(),
  pickupLat: z.number().optional(),
  pickupLng: z.number().optional(),
});

export async function GET() {
  const { error } = await requireAdminSession();
  if (error) return error;

  let settings = await prisma.siteSettings.findUnique({ where: { id: "settings" } });
  if (!settings) {
    settings = await prisma.siteSettings.create({ data: { id: "settings" } });
  }
  return NextResponse.json(settings);
}

export async function PATCH(request: NextRequest) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const body = await request.json();
    const data = schema.parse(body);

    const settings = await prisma.siteSettings.upsert({
      where: { id: "settings" },
      update: data,
      create: { id: "settings", ...data },
    });

    return NextResponse.json(settings);
  } catch (err) {
    console.error("Settings update error:", err);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
