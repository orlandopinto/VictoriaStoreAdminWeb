import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from '../src/locales/en/translation.json'; // English
import translationES from '../src/locales/es/translation.json'; // Spanish

const resources = {
     en: { translation: translationEN },
     es: { translation: translationES },
};

const currentLanguage = localStorage.getItem('lang') || 'es';

i18n.use(initReactI18next).init({
     fallbackLng: 'es',
     lng: currentLanguage,
     debug: false,
     resources,
     interpolation: {
          escapeValue: false,
     }
});

export default i18n;