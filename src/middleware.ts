import { NextResponse, type NextRequest } from "next/server";
import { updateSupabaseSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/") {
    const locale = request.cookies.get("portfolio-locale")?.value === "en" ? "en" : "fr";
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }
  return updateSupabaseSession(request);
}

export const config = {
  matcher: ["/", "/admin/:path*", "/api/admin/:path*"],
};
