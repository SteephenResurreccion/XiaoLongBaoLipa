import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
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
