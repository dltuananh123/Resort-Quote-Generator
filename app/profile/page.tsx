"use client";

import { useSession } from "next-auth/react";
import { ResortHeader } from "@/components/resort-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTranslation } from "@/lib/translation-context";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t } = useTranslation();

  // Chuyển hướng nếu chưa đăng nhập (mặc dù middleware sẽ xử lý điều này)
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Hiển thị trạng thái đang tải
  if (status === "loading") {
    return (
      <div className="min-h-screen flex flex-col">
        <ResortHeader />
        <div className="flex-1 flex items-center justify-center p-4">
          <p>{t("auth.loading")}</p>
        </div>
      </div>
    );
  }

  // Hiển thị thông tin người dùng đã đăng nhập
  return (
    <div className="min-h-screen flex flex-col">
      <ResortHeader />
      <div className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-sky-800">
          {t("auth.profileTitle")}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>{t("auth.personalInfo")}</CardTitle>
              <CardDescription>{t("auth.accountInfo")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={session?.user?.image || ""} />
                  <AvatarFallback className="text-lg bg-sky-100 text-sky-800">
                    {session?.user?.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold">
                    {session?.user?.name}
                  </h2>
                  <p className="text-gray-500">{session?.user?.email}</p>
                  <Badge className="mt-2 bg-sky-100 text-sky-800 hover:bg-sky-200">
                    {session?.user?.role === "admin"
                      ? t("auth.admin")
                      : t("auth.staff")}
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    {t("auth.id")}
                  </h3>
                  <p>{session?.user?.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    {t("auth.account")}
                  </h3>
                  <p>{session?.user?.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    {t("auth.role")}
                  </h3>
                  <p>
                    {session?.user?.role === "admin"
                      ? t("auth.admin")
                      : t("auth.staff")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle>{t("auth.activityStats")}</CardTitle>
              <CardDescription>{t("auth.recentActivity")}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 italic">{t("auth.comingSoon")}</p>
              <div className="mt-6 p-4 bg-sky-50 rounded-lg">
                <h3 className="font-medium text-sky-800 mb-2">
                  {t("auth.note")}
                </h3>
                <p className="text-sm text-gray-600">{t("auth.demoNote")}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
