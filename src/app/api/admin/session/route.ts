import { NextResponse } from "next/server";
import { getAdminContext } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const context = await getAdminContext();
  if (!context) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: { "Cache-Control": "private, no-store" } },
    );
  }

  return NextResponse.json(
    { authenticated: true },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}

