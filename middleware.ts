import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  // Đường dẫn của trang hiện tại
  const path = request.nextUrl.pathname;

  // Các đường dẫn được coi là công khai, không cần xác thực
  const publicPaths = ["/login"];
  const isPublicPath = publicPaths.includes(path);

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
  if (token && isPublicPath) {
    // Nếu đã đăng nhập rồi thì điều hướng đến trang chủ
    return NextResponse.redirect(new URL("/", request.url));
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
