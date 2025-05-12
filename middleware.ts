import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Define path structure and access permissions
interface RouteConfig {
  path: string;
  roles: string[];
}

// List of paths and corresponding access permissions
const protectedRoutes: RouteConfig[] = [
  { path: "/admin", roles: ["admin"] },
  { path: "/admin/dashboard", roles: ["admin"] },
  { path: "/admin/users", roles: ["admin"] },
  { path: "/profile", roles: ["admin", "user"] },
];

// List of public paths that don't require authentication
const publicPaths = ["/login", "/about", "/access-denied"];

export async function middleware(request: NextRequest) {
  // Current page path
  const path = request.nextUrl.pathname;

  // Check if the current path is public
  const isPublicPath = publicPaths.some(
    (publicPath) => path === publicPath || path.startsWith(publicPath + "/")
  );

  // Check if the user is logged in
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || "asteria-mui-ne-resort-secret-key",
  });

  // User is not logged in and trying to access a page that requires authentication
  if (!token && !isPublicPath) {
    // If not logged in, redirect to the login page
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", encodeURI(request.url));
    return NextResponse.redirect(url);
  }

  // User is logged in and trying to access the login page
  if (token && path === "/login") {
    // If already logged in, redirect to the home page
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If the user is an admin and trying to access the profile page, redirect to the admin page
  if (token && token.role === "admin" && path === "/profile") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // Check access permissions for protected pages
  if (token) {
    const userRole = token.role as string;

    // Check each protected path
    for (const route of protectedRoutes) {
      if (path === route.path || path.startsWith(route.path + "/")) {
        // If the user doesn't have access permission, redirect to the Access Denied page
        if (!route.roles.includes(userRole)) {
          return NextResponse.redirect(new URL("/access-denied", request.url));
        }
        break;
      }
    }
  }

  // Allow access in all other cases
  return NextResponse.next();
}

export const config = {
  // Apply middleware to the following paths
  matcher: [
    /*
     * Match all paths except:
     * 1. Static paths (css, js, images, favicon, etc.)
     * 2. API routes (/api/*)
     */
    "/((?!api|_next/static|_next/image|favicon|flags|logo).*)",
  ],
};
