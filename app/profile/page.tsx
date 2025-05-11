"use client";

import { useAuth } from "@/lib/auth-context";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ResortHeader } from "@/components/resort-header";
import { ResortFooter } from "@/components/resort-footer";

export default function ProfilePage() {
  const { isAuthenticated, isLoading, userRole } = useAuth();
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl font-bold">Đang tải...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ResortHeader />
      <div className="container mx-auto py-10 px-4 flex-grow">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Thông tin tài khoản</h1>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="relative w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600">
                  {session?.user?.name?.[0] || "U"}
                </div>

                <div className="flex-1">
                  <h2 className="text-2xl font-semibold">
                    {session?.user?.name || "Người dùng"}
                  </h2>
                  <p className="text-gray-600">{session?.user?.email}</p>
                  <div className="mt-2">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {userRole === "admin" ? "Admin" : "Người dùng"}
                    </span>
                  </div>
                </div>

                <div className="mt-4 md:mt-0">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Chỉnh sửa thông tin
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 p-6">
              <h3 className="text-xl font-semibold mb-4">Thông tin cá nhân</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ và tên
                  </label>
                  <div className="p-2 bg-gray-50 rounded border border-gray-200">
                    {session?.user?.name || "Chưa cập nhật"}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="p-2 bg-gray-50 rounded border border-gray-200">
                    {session?.user?.email || "Chưa cập nhật"}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại
                  </label>
                  <div className="p-2 bg-gray-50 rounded border border-gray-200">
                    Chưa cập nhật
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày sinh
                  </label>
                  <div className="p-2 bg-gray-50 rounded border border-gray-200">
                    Chưa cập nhật
                  </div>
                </div>
              </div>
            </div>

            {userRole === "admin" && (
              <div className="border-t border-gray-200 p-6 bg-yellow-50">
                <h3 className="text-xl font-semibold mb-4">Quyền Admin</h3>
                <p className="text-gray-700 mb-4">
                  Bạn có quyền truy cập vào khu vực quản trị. Để truy cập bảng
                  điều khiển Admin, hãy nhấp vào nút bên dưới.
                </p>
                <button
                  onClick={() => router.push("/admin")}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Đi đến trang Admin
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <ResortFooter />
    </div>
  );
}
