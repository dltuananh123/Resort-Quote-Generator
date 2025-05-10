import { Language } from "./translations";

export type LanguageInfo = {
  code: Language;
  name: string;
  nativeName: string;
  direction: "ltr" | "rtl";
};

export const supportedLanguages: LanguageInfo[] = [
  { code: "en", name: "English", nativeName: "English", direction: "ltr" },
  {
    code: "vi",
    name: "Vietnamese",
    nativeName: "Tiếng Việt",
    direction: "ltr",
  },
  { code: "cn", name: "Chinese", nativeName: "中文", direction: "ltr" },
  { code: "ru", name: "Russian", nativeName: "Русский", direction: "ltr" },
  { code: "kr", name: "Korean", nativeName: "한국어", direction: "ltr" },
];

// Function to get the initial language from localStorage with a fallback to "vi"
export const getInitialLanguage = (): Language => {
  if (typeof window !== "undefined") {
    const savedLanguage = localStorage.getItem("language");
    if (
      savedLanguage === "en" ||
      savedLanguage === "vi" ||
      savedLanguage === "cn" ||
      savedLanguage === "ru" ||
      savedLanguage === "kr"
    ) {
      return savedLanguage;
    }
  }
  return "vi"; // Default fallback
};

// Function to get language information based on code
export const getLanguageInfo = (code: Language): LanguageInfo => {
  const langInfo = supportedLanguages.find((lang) => lang.code === code);
  if (!langInfo) {
    // Return default if not found
    return supportedLanguages[0];
  }
  return langInfo;
};
