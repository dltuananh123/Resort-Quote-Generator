import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

// Define path structures and access permissions
export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|access-denied|.*.svg).*)",
  ],
};

// List of paths and corresponding access permissions
const protectedPaths = [
  { path: "/admin", role: "admin" },
  { path: "/users", role: "admin" },
  { path: "/api/users", role: "admin" },
];

// List of public paths that don't require authentication
const publicPaths = ["/", "/auth/login", "/access-denied"];

export function middleware(request: NextRequest) {
  // Current page path
  const path = request.nextUrl.pathname;

  // Check if current path is public
  const isPublicPath = publicPaths.some((publicPath) =>
    path.startsWith(publicPath)
  );

  // Check if user is authenticated
  const token = request.cookies.get("auth-token")?.value;
  const isAuthenticated = !!token;

  // Ensure token is valid and not expired
  const isValidToken = token ? !isTokenExpired(token) : false;
  const isAuthValid = isAuthenticated && isValidToken;

  // User is not authenticated and trying to access a protected page
  if (!isAuthValid && !isPublicPath) {
    // Redirect to login page if not authenticated
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // User is authenticated and trying to access the login page
  if (isAuthValid && path === "/auth/login") {
    // Redirect to home page if already logged in
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If user is admin and accessing profile page, redirect to admin page
  if (isAuthValid && path === "/auth/profile") {
    const userData = token ? jwtDecode<any>(token) : null;
    if (userData?.role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  // Check access permissions for protected paths
  if (isAuthValid) {
    const userData = jwtDecode<any>(token);

    // Check each protected path
    for (const { path: protectedPath, role } of protectedPaths) {
      if (path.startsWith(protectedPath) && userData.role !== role) {
        // Redirect to access denied page if user doesn't have access
        return NextResponse.redirect(new URL("/access-denied", request.url));
      }
    }
  }

  // Allow access in all other cases
  return NextResponse.next();
}

// Apply middleware to the following paths
function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<{ exp: number }>(token);
    return decoded.exp < Date.now() / 1000;
  } catch (e) {
    return true;
  }
}
