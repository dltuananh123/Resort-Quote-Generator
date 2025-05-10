"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { translations, Language, TranslationKeys } from "./translations";

type TranslationContextType = {
  t: (key: string) => string;
  currentLanguage: Language;
  changeLanguage: (lang: Language) => void;
  languages: { code: Language; name: string }[];
};

const TranslationContext = createContext<TranslationContextType | undefined>(
  undefined
);

type NestedObject = {
  [key: string]: string | NestedObject;
};

// Function to get the initial language from localStorage with a fallback to "vi"
const getInitialLanguage = (): Language => {
  if (typeof window !== "undefined") {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage === "en" || savedLanguage === "vi") {
      return savedLanguage;
    }
  }
  return "vi"; // Default fallback
};

export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  // Initialize with a function to prevent unnecessary re-renders
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() =>
    getInitialLanguage()
  );

  useEffect(() => {
    // Make sure the language is saved in localStorage on initial load
    if (typeof window !== "undefined") {
      localStorage.setItem("language", currentLanguage);
    }
  }, [currentLanguage]);

  const languages = [
    { code: "en" as const, name: "English" },
    { code: "vi" as const, name: "Tiếng Việt" },
  ];

  const changeLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("language", lang);
    }
  };

  // Translation function
  const t = (key: string): string => {
    try {
      const keys = key.split(".");
      let result: string | NestedObject = translations[
        currentLanguage
      ] as NestedObject;

      for (const k of keys) {
        if (result && typeof result === "object" && k in result) {
          result = result[k];
        } else {
          // Fallback to English if key not found
          let fallback: string | NestedObject = translations.en as NestedObject;
          for (const fk of keys) {
            if (fallback && typeof fallback === "object" && fk in fallback) {
              fallback = fallback[fk];
            } else {
              return key; // If not found in fallback, return the key itself
            }
          }
          return typeof fallback === "string" ? fallback : key;
        }
      }

      return typeof result === "string" ? result : key;
    } catch (error) {
      console.error(`Translation error for key: ${key}`, error);
      return key;
    }
  };

  return (
    <TranslationContext.Provider
      value={{ t, currentLanguage, changeLanguage, languages }}
    >
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
};
