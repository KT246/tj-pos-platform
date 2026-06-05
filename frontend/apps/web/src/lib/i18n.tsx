"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";

import {
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  isLanguage,
  translate,
  type Language
} from "@workspace/i18n";

export type { Language } from "@workspace/i18n";

type I18nContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (text: string) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);
  const [hasLoadedLanguage, setHasLoadedLanguage] = useState(false);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);

      if (stored && isLanguage(stored)) {
        setLanguageState(stored);
      }

      setHasLoadedLanguage(true);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === "lo" ? "lo" : "en";
    document.body.classList.toggle("language-lo", language === "lo");
    document.body.classList.toggle("language-en", language === "en");

    if (hasLoadedLanguage) {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    }
  }, [hasLoadedLanguage, language]);

  const setLanguage = useCallback((nextLanguage: Language) => {
    setLanguageState(nextLanguage);
  }, []);

  const t = useCallback((text: string) => translate(language, text), [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t
    }),
    [language, setLanguage, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used inside LanguageProvider");
  }

  return context;
}
