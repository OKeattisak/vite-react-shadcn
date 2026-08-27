import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import en from "@/locales/en";
import th from "@/locales/th";

function updateDocumentLanguage(language: string) {
  document.documentElement.lang = language;
  document.documentElement.dir = i18n.dir(language);
}

i18n.on("languageChanged", updateDocumentLanguage);

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      th: { translation: th },
      en: { translation: en },
    },
    supportedLngs: ["th", "en"],
    fallbackLng: "th",
    load: "languageOnly",

    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: "vite-ui-language",
      caches: ["localStorage"],
    },

    interpolation: {
      escapeValue: false,
    },

    debug: import.meta.env.DEV,
  });

export default i18n;
