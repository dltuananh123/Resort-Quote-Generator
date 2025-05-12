import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Định nghĩa cấu trúc đường dẫn và quyền truy cập
interface RouteConfig {
  path: string;
  roles: string[];
}

// Danh sách đường dẫn và quyền truy cập tương ứng
const protectedRoutes: RouteConfig[] = [
  { path: "/admin", roles: ["admin"] },
  { path: "/admin/dashboard", roles: ["admin"] },
  { path: "/admin/users", roles: ["admin"] },
  { path: "/profile", roles: ["admin", "user"] },
];

// Danh sách đường dẫn công khai không cần xác thực
const publicPaths = ["/login", "/about", "/access-denied"];

export async function middleware(request: NextRequest) {
  // Đường dẫn của trang hiện tại
  const path = request.nextUrl.pathname;

  // Kiểm tra xem đường dẫn hiện tại có phải là công khai không
  const isPublicPath = publicPaths.some(
    (publicPath) => path === publicPath || path.startsWith(publicPath + "/")
  );

  // Kiểm tra xem người dùng đã đăng nhập chưa
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || "asteria-mui-ne-resort-secret-key",
  });

  // Người dùng chưa đăng nhập và đang cố truy cập trang yêu cầu xác thực
  if (!token && !isPublicPath) {
    // Nếu chưa đăng nhập thì điều hướng đến trang đăng nhập
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", encodeURI(request.url));
    return NextResponse.redirect(url);
  }

  // Người dùng đã đăng nhập và đang cố truy cập trang đăng nhập
  if (token && path === "/login") {
    // Nếu đã đăng nhập rồi thì điều hướng đến trang chủ
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Nếu người dùng là admin và đang cố truy cập trang hồ sơ, chuyển hướng đến trang quản trị
  if (token && token.role === "admin" && path === "/profile") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // Kiểm tra quyền truy cập cho các trang được bảo vệ
  if (token) {
    const userRole = token.role as string;

    // Kiểm tra từng đường dẫn được bảo vệ
    for (const route of protectedRoutes) {
      if (path === route.path || path.startsWith(route.path + "/")) {
        // Nếu người dùng không có quyền truy cập, chuyển hướng đến trang Access Denied
        if (!route.roles.includes(userRole)) {
          return NextResponse.redirect(new URL("/access-denied", request.url));
        }
        break;
      }
    }
  }

  // Cho phép truy cập trang trong các trường hợp còn lại
  return NextResponse.next();
}

export const config = {
  // Áp dụng middleware cho các đường dẫn sau
  matcher: [
    /*
     * Khớp với tất cả các đường dẫn ngoại trừ:
     * 1. Các đường dẫn tĩnh (css, js, images, favicon, v.v.)
     * 2. API routes (/api/*)
     */
    "/((?!api|_next/static|_next/image|favicon|flags|logo).*)",
  ],
};
