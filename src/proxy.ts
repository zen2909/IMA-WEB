import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Pengecekan optimistis saja: kalau cookie sesi tidak ada, arahkan ke /masuk
 * supaya tidak sempat merender halaman admin. Ini BUKAN penjaga keamanan —
 * verifikasi sebenarnya ada di app/admin/layout.tsx dan di setiap server
 * action. Proxy sengaja tidak menyentuh database.
 */
export function proxy(request: NextRequest) {
  const punyaCookie = request.cookies.has("ima_session");

  if (!punyaCookie) {
    const url = new URL("/masuk", request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/kadiv/:path*"],
};