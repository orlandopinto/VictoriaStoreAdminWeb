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

     const [selectedLanguage, setSelectedLanguage] = useLocalStorage("currentLanguage", { languageName: 'English', locale: 'en', img: 'ukflag' })
     const languages: Language[] = [
          { languageName: 'Español', locale: 'es', img: 'esflag' },
          { languageName: 'English', locale: 'en', img: 'ukflag' },
          // { languageName: 'Catalán', locale: 'ca' },
     ];

     const selectedImageLanguage = (languageName: string) => {
          switch (languageName) {
               case 'Español':
                    return esflag
               case 'English':
                    return ukflag
               default:
                    return esflag
          }
     }

     const LanguageOptionTemplate = (option: Language) => {
          return (<img alt={option.languageName} src={selectedImageLanguage(option.languageName)} className={`flag flag-${option.locale.toLowerCase()}`} style={{ width: '25px' }} />);
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