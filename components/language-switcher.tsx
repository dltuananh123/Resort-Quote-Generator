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
  const { currentLanguage, changeLanguage, languages } = useTranslation();

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
            alt={currentLanguage === "vi" ? "Tiếng Việt" : "English"}
            width={20}
            height={12}
            className="mr-1.5"
          />
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
            <div className="flex items-center">
              <Image
                src={`/flags/${language.code}.svg`}
                alt={language.name}
                width={24}
                height={14}
                className="mr-2"
              />
              <span>{language.name}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
