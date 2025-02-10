import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import ukflag from '../../assets/flags/en-flag.svg';
import esflag from '../../assets/flags/es-flag.svg';
import useLocalStorage from '../../hooks/useLocalStorage';
import i18n from '../../i18n';
import { Language } from '../../types/language.type';

const LanguageSwitcher = () => {

     const changeLanguage = (lng: string) => {
          i18n.changeLanguage(lng);
     }

     const [selectedLanguage, setSelectedLanguage] = useLocalStorage("currentLanguage", { locale: 'en', img: 'ukflag' })
     const languages: Language[] = [
          { locale: 'es', img: 'esflag' },
          { locale: 'en', img: 'ukflag' },
          // {  locale: 'ca': img: 'caflag' },
     ];

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

     const LanguageOptionTemplate = (option: Language) => {
          return (<img alt={option.locale} src={selectedImageLanguage(option.locale)} style={{ width: '25px' }} />);
     };

     return (
          <Dropdown
               style={{ width: '70px !important', border: 0, background: 'transparent' }}
               value={selectedLanguage}
               onChange={(e: DropdownChangeEvent) => {
                    changeLanguage(e.value.locale)
                    setSelectedLanguage(e.value)
               }}
               options={languages}
               valueTemplate={LanguageOptionTemplate}
               itemTemplate={LanguageOptionTemplate}
               className="dropDownLanguageSwitcher"
          />
     );
};

export default LanguageSwitcher;