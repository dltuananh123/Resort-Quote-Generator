import { en } from "./en";
import { vi } from "./vi";
import { cn } from "./cn";
import { ru } from "./ru";
import { kr } from "./kr";

export type Language = "en" | "vi" | "cn" | "ru" | "kr";

export const translations = {
  en,
  vi,
  cn,
  ru,
  kr,
};

export type TranslationKeys = typeof en;
