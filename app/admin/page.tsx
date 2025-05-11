"use client";

import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ResortHeader } from "@/components/resort-header";
import { ResortFooter } from "@/components/resort-footer";
import { UsersManager } from "@/components/users-manager";
import { Users, BookOpen, BarChart3, Settings, Menu, X } from "lucide-react";

export default function AdminDashboard() {
  const { isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push("/");
    }
  }, [isAdmin, isLoading, router]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl font-bold">Đang tải...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ResortHeader />

      <div className="flex-grow flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="hidden md:block w-64 bg-blue-800 text-white p-6">
          <h2 className="text-xl font-bold mb-6">Quản trị viên</h2>
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                activeTab === "dashboard"
                  ? "bg-blue-700 text-white"
                  : "hover:bg-blue-700"
              }`}
            >
              <BarChart3 className="w-5 h-5 mr-3" />
              <span>Tổng quan</span>
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                activeTab === "users"
                  ? "bg-blue-700 text-white"
                  : "hover:bg-blue-700"
              }`}
            >
              <Users className="w-5 h-5 mr-3" />
              <span>Người dùng</span>
            </button>

            <button
              onClick={() => setActiveTab("bookings")}
              className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                activeTab === "bookings"
                  ? "bg-blue-700 text-white"
                  : "hover:bg-blue-700"
              }`}
            >
              <BookOpen className="w-5 h-5 mr-3" />
              <span>Đặt phòng</span>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                activeTab === "settings"
                  ? "bg-blue-700 text-white"
                  : "hover:bg-blue-700"
              }`}
            >
              <Settings className="w-5 h-5 mr-3" />
              <span>Cài đặt</span>
            </button>
          </nav>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden bg-blue-800 text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Quản trị viên</h2>
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-md hover:bg-blue-700"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-blue-700 text-white">
            <nav className="p-4 space-y-2">
              <button
                onClick={() => {
                  setActiveTab("dashboard");
                  toggleMobileMenu();
                }}
                className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                  activeTab === "dashboard"
                    ? "bg-blue-600 text-white"
                    : "hover:bg-blue-600"
                }`}
              >
                <BarChart3 className="w-5 h-5 mr-3" />
                <span>Tổng quan</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("users");
                  toggleMobileMenu();
                }}
                className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                  activeTab === "users"
                    ? "bg-blue-600 text-white"
                    : "hover:bg-blue-600"
                }`}
              >
                <Users className="w-5 h-5 mr-3" />
                <span>Người dùng</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("bookings");
                  toggleMobileMenu();
                }}
                className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                  activeTab === "bookings"
                    ? "bg-blue-600 text-white"
                    : "hover:bg-blue-600"
                }`}
              >
                <BookOpen className="w-5 h-5 mr-3" />
                <span>Đặt phòng</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("settings");
                  toggleMobileMenu();
                }}
                className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                  activeTab === "settings"
                    ? "bg-blue-600 text-white"
                    : "hover:bg-blue-600"
                }`}
              >
                <Settings className="w-5 h-5 mr-3" />
                <span>Cài đặt</span>
              </button>
            </nav>
          </div>
        )}

        {/* Content area */}
        <div className="flex-grow p-6 bg-gray-50">
          {activeTab === "dashboard" && (
            <div>
              <h1 className="text-2xl font-bold mb-6">Tổng quan</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold mb-4">Người dùng</h2>
                  <p className="text-gray-600 mb-2">Tổng số người dùng: 100</p>
                  <p className="text-gray-600 mb-2">
                    Người dùng mới (30 ngày): 12
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold mb-4">Đặt phòng</h2>
                  <p className="text-gray-600 mb-2">Tổng số đặt phòng: 250</p>
                  <p className="text-gray-600 mb-2">
                    Đặt phòng mới (7 ngày): 28
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold mb-4">Báo cáo</h2>
                  <p className="text-gray-600 mb-2">
                    Doanh thu tháng này: $42,500
                  </p>
                  <p className="text-gray-600 mb-2">Tỷ lệ lấp đầy: 78%</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div>
              <h1 className="text-2xl font-bold mb-6">Quản lý người dùng</h1>
              <UsersManager />
            </div>
          )}

          {activeTab === "bookings" && (
            <div>
              <h1 className="text-2xl font-bold mb-6">Quản lý đặt phòng</h1>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-gray-500 italic">
                  Chức năng đang được phát triển...
                </p>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div>
              <h1 className="text-2xl font-bold mb-6">Cài đặt hệ thống</h1>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-gray-500 italic">
                  Chức năng đang được phát triển...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <ResortFooter />
    </div>
  );
}
