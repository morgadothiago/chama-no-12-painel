import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Protect dashboard routes
  if (path.startsWith("/dashboard")) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Only admin role can access the ops dashboard
    if (token.role !== "admin") {
      return NextResponse.redirect(new URL("/login?error=unauthorized", req.url));
    }
  }

  // Redirect logged-in admins away from login page
  if (path === "/login") {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (token && token.role === "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
