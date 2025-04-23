import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    try {
        const session = request.cookies.get("session");
        const pathname = request.nextUrl.pathname;
        // Handle root path - redirect to dashboard if authenticated, login if not
        if (pathname === "/") {
            if (session) {
                return NextResponse.redirect(
                    new URL("/dashboard", request.url)
                );
            } else {
                return NextResponse.redirect(new URL("/login", request.url));
            }
        }
        // Protected routes require authentication
        const isProtectedRoute =
            pathname.startsWith("/dashboard") ||
            pathname.startsWith("/users") ||
            pathname.startsWith("/memberships") ||
            pathname.startsWith("/analytics") ||
            pathname.startsWith("/settings") ||
            pathname.startsWith("/profile") ||
            pathname.startsWith("/account") ||
            pathname.startsWith("/notifications") ||
            pathname.startsWith("/help") ||
            pathname.startsWith("/billing");

        // Auth routes are for non-authenticated users
        const isAuthRoute =
            pathname.startsWith("/login") ||
            pathname.startsWith("/register") ||
            pathname.startsWith("/(auth)");

        // If trying to access a protected route without a session, redirect to login
        if (isProtectedRoute && !session) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        // If trying to access an auth route with a session, redirect to dashboard
        if (isAuthRoute && session) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }

        return NextResponse.next();
    } catch (error) {
        console.error("Middleware error:", error);
        // If there's an error, just continue to the page
        return NextResponse.next();
    }
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
