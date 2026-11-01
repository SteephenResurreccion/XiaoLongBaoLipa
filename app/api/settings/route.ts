import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isDemo } from "@/lib/demo";

export async function GET() {
  if (isDemo()) {
    return NextResponse.json({ isOpen: true, closedMessage: "", pickupAddress: "Lipa City, Batangas" });
  }
  try {
    let settings = await prisma.siteSettings.findUnique({
      where: { id: "settings" },
    });

    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: { id: "settings" },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Settings fetch error:", error);
    return NextResponse.json(
      { isOpen: true, closedMessage: "", pickupAddress: "Lipa City, Batangas" },
      { status: 200 }
    );
  }
}
