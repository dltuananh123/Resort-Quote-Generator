"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, LogIn, Settings } from "lucide-react";
import { useTranslation } from "@/lib/translation-context";

export function AuthButton() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { t } = useTranslation();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut({ redirect: false });
    router.push("/login");
    setIsLoggingOut(false);
  };

  const handleLogin = () => {
    router.push("/login");
  };

  const handleProfileClick = () => {
    if (session?.user?.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/profile");
    }
  };

  if (status === "loading") {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-1 h-9 text-white hover:bg-sky-800 hover:text-white border border-sky-700 opacity-50"
        disabled
      >
        <User className="mr-1.5 h-4 w-4" />
        <span>{t("auth.loading")}</span>
      </Button>
    );
  }

  if (session && session.user) {
    const isAdmin = session.user.role === "admin";

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 h-9 text-white hover:bg-sky-800 hover:text-white border border-sky-700"
          >
            <User className="mr-1.5 h-4 w-4" />
            <span>{session.user.name || session.user.email}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel>{t("auth.yourAccount")}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex items-center"
            onClick={handleProfileClick}
          >
            {isAdmin ? (
              <>
                <Settings className="mr-2 h-4 w-4" />
                <span>{t("auth.admin")}</span>
              </>
            ) : (
              <>
                <User className="mr-2 h-4 w-4" />
                <span>{t("auth.profile")}</span>
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex items-center text-red-600 focus:text-red-600"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>
              {isLoggingOut ? t("auth.loggingOut") : t("auth.logout")}
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="flex items-center gap-1 h-9 text-white hover:bg-sky-800 hover:text-white border border-sky-700"
      onClick={handleLogin}
    >
      <LogIn className="mr-1.5 h-4 w-4" />
      <span>{t("auth.login")}</span>
    </Button>
  );
}
