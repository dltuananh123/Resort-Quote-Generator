"use client";

import React from "react";
import { useTranslation } from "@/lib/translation-context";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LanguageSwitcher() {
  const { currentLanguage, changeLanguage, languages } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 h-9 text-white hover:bg-sky-800 hover:text-white border border-sky-700"
        >
          <Globe className="h-4 w-4 mr-1" />
          <span>{currentLanguage === "vi" ? "VI" : "EN"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-white min-w-[150px] shadow-lg"
      >
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className={
              currentLanguage === language.code
                ? "bg-sky-100 text-sky-900 font-medium"
                : "text-gray-800 hover:bg-sky-50"
            }
          >
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
