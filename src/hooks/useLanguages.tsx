import { useState } from "react";
import i18n from "../i18n";
import { Language } from "../types/language.type";

const useLanguages = (esflag: any, ukflag: any) => {
     //LANGUAGE SELECTION SECTION
     const changeLanguage = (lng: string) => {
          i18n.changeLanguage(lng);
     }

     const lang = localStorage.getItem('lang')

     const languages: Language[] = [
          { locale: 'es', img: 'esflag' },
          { locale: 'en', img: 'ukflag' }
          //{ locale: 'ca', img: 'caflag' },
     ];

     const currentLanguage: Language = {
          locale: lang!,
          img: languages.find(language => language.locale === lang)?.img as string
     }

     const [selectedLanguage, setSelectedLanguage] = useState<Language>(currentLanguage)

     const selectedImageLanguage = (locale: string) => {
          switch (locale) {
               case 'es':
                    return esflag
               case 'en':
                    return ukflag
               // case 'ca':
               //      return caflag
               default:
                    return esflag
          }
     }

     return [languages, changeLanguage, selectedLanguage, setSelectedLanguage, selectedImageLanguage];
}

export default useLanguages