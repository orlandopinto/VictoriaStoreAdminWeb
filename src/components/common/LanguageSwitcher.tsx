import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import ukflag from '../../assets/flags/en-flag.svg';
import esflag from '../../assets/flags/es-flag.svg';
import useLanguages from '../../hooks/useLanguages';
import { Language } from '../../types/language.type';

const LanguageSwitcher = () => {

     const [languages, changeLanguage, selectedLanguage, setSelectedLanguage, selectedImageLanguage] = useLanguages(esflag, ukflag) as any;

     const LanguageOptionTemplate = (option: Language) => {
          if (option)
               return (<img alt={option.locale} src={selectedImageLanguage(option.locale)} style={{ width: '25px' }} />);
          else
               return (<img alt={"Español"} src={selectedImageLanguage("es")} style={{ width: '25px' }} />);
     };

     return (
          <Dropdown
               style={{ width: '70px !important', border: 0, background: 'transparent' }}
               value={selectedLanguage}
               onChange={(e: DropdownChangeEvent) => {
                    changeLanguage(e.value.locale)
                    setSelectedLanguage(e.value)
                    localStorage.setItem('lang', e.value.locale)
               }}
               options={languages}
               valueTemplate={LanguageOptionTemplate}
               itemTemplate={LanguageOptionTemplate}
               className="dropDownLanguageSwitcher"
          />
     );
};

export default LanguageSwitcher;