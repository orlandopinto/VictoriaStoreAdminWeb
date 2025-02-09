import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from '../public/locales/en/translation.json'; // English
import translationES from '../public/locales/es/translation.json'; // Spanish
import { Language } from './types/language.type';

const resources = {
     en: { translation: translationEN },
     es: { translation: translationES },
};

const currentLanguage = JSON.parse(localStorage.getItem('currentLanguage') || '{"languageName": "Español", "locale": "es", "img": "esflag"}') as Language;

i18n.use(initReactI18next).init({
     fallbackLng: 'es',
     lng: currentLanguage.locale,
     debug: false,
     resources,
     interpolation: {
          escapeValue: false,
     }
});

export default i18n;