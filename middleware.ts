import { NextResponse, NextRequest } from "next/server";
import { verifyToken } from "./lib/auth";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    const { pathname } = request.nextUrl;

    const publicRoutes = ["/login", "/signup", "/"];
    const isPublicRoute = publicRoutes.includes(pathname);

    // If no token and trying to access protected route
    if (!token && !isPublicRoute && !pathname.startsWith("/api/auth")) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // If token exists and trying to access login/signup
    if (token && (pathname === "/login" || pathname === "/signup")) {
        // Verify token just to be sure
        const decoded = verifyToken(token);
        if (decoded) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
