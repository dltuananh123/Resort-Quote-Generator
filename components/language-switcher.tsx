"use client";

import React from "react";
import Image from "next/image";
import { useTranslation } from "@/lib/translation-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LanguageSwitcher() {
  const { currentLanguage, changeLanguage, languages, languageInfo } =
    useTranslation();

  // Function to get display code for button
  const getDisplayCode = (code: string) => {
    if (code === "cn") return "中文";
    if (code === "ru") return "РУ";
    if (code === "kr") return "한국";
    return code.toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 h-9 text-white hover:bg-sky-800 hover:text-white border border-sky-700"
        >
          <Image
            src={`/flags/${currentLanguage}.svg`}
            alt={languageInfo.name}
            width={20}
            height={12}
            className="mr-1.5"
          />
          <span>{getDisplayCode(currentLanguage)}</span>
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
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <Image
                  src={`/flags/${language.code}.svg`}
                  alt={language.name}
                  width={24}
                  height={14}
                  className="mr-2"
                />
                <span>{language.nativeName}</span>
              </div>
              <span className="text-xs text-gray-500 font-mono">
                {language.code === "cn"
                  ? "中文"
                  : language.code === "ru"
                  ? "РУ"
                  : language.code === "kr"
                  ? "한국"
                  : language.code.toUpperCase()}
              </span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
