import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

export async function requireAdminSession() {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return { session: null, error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  if (session.user.email !== process.env.OWNER_GOOGLE_EMAIL) {
    return { session: null, error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { session, error: null };
}
