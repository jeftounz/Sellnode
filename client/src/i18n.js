import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importamos ambos diccionarios
import enTranslation from './locales/en.json';
import esTranslation from './locales/es.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      es: { translation: esTranslation }
    },
    fallbackLng: 'en', // Si el idioma del navegador no es ni inglés ni español, usa inglés
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;