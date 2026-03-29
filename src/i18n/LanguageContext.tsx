import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { en } from "./en";
import { fr } from "./fr";
import { es } from "./es";
import { ar } from "./ar";
import { zh } from "./zh";
import { ru } from "./ru";

export type Language = "en" | "fr" | "es" | "ar" | "zh" | "ru";
type Translations = typeof en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const validLanguages: Language[] = ["en", "fr", "es", "ar", "zh", "ru"];
const translations: Record<Language, Translations> = { en, fr, es, ar, zh, ru };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }): JSX.Element {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("language") as Language;
      return saved && validLanguages.includes(saved) ? saved : "fr";
    }
    return "fr";
  });

  const setLanguage = (lang: Language): void => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

export function useTranslation() {
  const { t, language, setLanguage } = useLanguage();
  return { t, language, setLanguage };
}
