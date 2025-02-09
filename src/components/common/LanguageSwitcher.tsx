import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import ukflag from '../../assets/flags/en-flag.svg'
import esflag from '../../assets/flags/es-flag.svg'
import { useState } from "react";

interface Language {
     languageName: string;
     locale: string;
     img: string;
}

const LanguageSwitcher = () => {
     const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
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

     const selectedLanguageTemplate = (option: Language, props: any) => {
          if (option) {
               return (
                    <div className="flex align-items-center">
                         <img alt={option.languageName} src={selectedImageLanguage(option.languageName)} className={`mr-2 flag flag-${option.locale.toLowerCase()}`} style={{ width: '18px' }} />
                         {/* <div>{option.languageName}</div> */}
                    </div>
               );
          }

          return <span>{props.placeholder}</span>;
     };

     const LanguageOptionTemplate = (option: Language) => {
          return (
               <div className="flex align-items-center">
                    <img alt={option.languageName} src={selectedImageLanguage(option.languageName)} className={`mr-2 flag flag-${option.locale.toLowerCase()}`} style={{ width: '18px' }} />
                    {/* <div>{option.languageName}</div> */}
               </div>
          );
     };

     return (
          <Dropdown
               style={{ width: '123px !important' }}
               value={selectedLanguage}
               onChange={(e: DropdownChangeEvent) => setSelectedLanguage(e.value)}
               options={languages}
               //optionLabel="languageName"
               //placeholder="Select a Language"
               valueTemplate={selectedLanguageTemplate}
               itemTemplate={LanguageOptionTemplate}
               className="dropDownLanguageSwitcher"
               dropdownIcon={(opts) => {
                    return (opts.iconProps as any)['data-pr-overlay-visible'] ? <i className='pi pi-chevron-up' /> : <i className='pi pi-chevron-down' />;
               }} />
     );
};

export default LanguageSwitcher;