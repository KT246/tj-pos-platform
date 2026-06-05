import en from "./locales/en.json";
import lo from "./locales/lo.json";

export type Language = "en" | "lo";

export const DEFAULT_LANGUAGE: Language = "en";
export const LANGUAGE_STORAGE_KEY = "tj-pos-web-language";
export const SUPPORTED_LANGUAGES = ["en", "lo"] as const;
export const locales: Record<Language, Record<string, string>> = { en, lo };

export function isLanguage(value: string): value is Language {
  return SUPPORTED_LANGUAGES.includes(value as Language);
}

export function translate(language: Language, key: string) {
  return locales[language][key] ?? key;
}
