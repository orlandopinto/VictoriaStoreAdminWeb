import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox';
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from 'primereact/inputtext';
import { ListBox, ListBoxChangeEvent } from 'primereact/listbox';
import { OverlayPanel } from 'primereact/overlaypanel';
import { useRef, useState } from 'react';
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from 'react-router-dom';
import ukflag from '../../assets/flags/en-flag.svg';
import esflag from '../../assets/flags/es-flag.svg';
import loginImage from '../../assets/svg/login.svg';
import logo from '../../assets/svg/logo.svg';
import useLocalStorage from '../../hooks/useLocalStorage';
import i18n from '../../i18n';
import { Language } from '../../types/language.type';
import './login.css';

function Login() {

     const { t } = useTranslation();
     const navigate = useNavigate();
     const [value, setValue] = useState<string>('');
     const [password, setPassword] = useState<string>('');
     const [checked, setChecked] = useState(false);

     //LANGUAGE SELECTION SECTION
     const changeLanguage = (lng: string) => {
          i18n.changeLanguage(lng);
     }
     const [selectedLanguage, setSelectedLanguage] = useLocalStorage("currentLanguage", { locale: 'es', img: 'esflag' })
     const languageOptionRef = useRef<OverlayPanel>(null);
     const languages: Language[] = [{ locale: 'en', img: 'ukflag' }, { locale: 'es', img: 'esflag' },];
     const languagesTemplate = (option: Language) => {
          return (<img alt={option.locale} src={option.img === 'ukflag' ? ukflag : esflag} style={{ width: '2rem' }} />);
     };

     return (
          <div className='login-wrapper'>
               <div className="login">
                    <div className="side-left">
                         <div className='logo -login-intro-x'>
                              <div>
                                   <img alt="Victoria Store" src={logo} />
                              </div>
                              <div>
                                   <span className='company-name'>Victoria Store</span>
                              </div>
                         </div>
                         <div className="login-image -login-intro-x">
                              <img alt="Victoria Store" src={loginImage} />
                         </div>
                         <div className='paragraph-1 -login-intro-x'>
                              <h1>{t('login.primary-content-text')}</h1>
                         </div>
                         <div className='paragraph-2 -login-intro-x'>
                              <span className='text-2xl'>{t('login.secondary-content-text')}</span>
                         </div>
                    </div>
                    <div className="side-right">
                         <div className='login-intro-x language-section'>
                              <Avatar className='avatar-image' image={selectedLanguage?.locale === 'en' ? ukflag : esflag} size="normal" onClick={(e) => languageOptionRef.current?.toggle(e)} />
                              <OverlayPanel className="overlay-language-list-container" ref={languageOptionRef} showCloseIcon closeOnEscape dismissable={false}>
                                   <ListBox
                                        itemTemplate={languagesTemplate}
                                        value={selectedLanguage}
                                        onClick={() => languageOptionRef.current?.hide()}
                                        onChange={(e: ListBoxChangeEvent) => {
                                             if (e.value !== null) {
                                                  setSelectedLanguage(e.value)
                                                  changeLanguage(e.value.locale)
                                             }
                                        }}
                                        options={languages}
                                        optionLabel="name"
                                        className="language-list" />
                              </OverlayPanel>
                         </div>
                         <div className="login-controls">
                              <div className="login-intro-x font-medium text-4xl pb-5">
                                   <span>{t('login.sign-in')}</span>
                              </div>
                              <div className="login-intro-x mt-3 text-lg">
                                   <IconField iconPosition="left">
                                        <InputIcon className="pi pi-user" />
                                        <InputText id="email" name="email" placeholder={t('login.placeholder-email')} value={value} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)} ></InputText>
                                   </IconField>
                              </div>
                              <div className="login-intro-x mt-3 text-lg">
                                   <IconField iconPosition="left">
                                        <InputIcon className="pi pi-lock" />
                                        <InputText id="password" name="password" placeholder={t('login.password')} type="password" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />
                                   </IconField>
                              </div>
                              <div className="login-intro-x remenber-section">
                                   <div className='checkbox-section'>
                                        <Checkbox name="chkRememberMe" inputId='chkRememberMe' onChange={(ev: CheckboxChangeEvent) => setChecked(ev.checked as boolean)} checked={checked} />
                                        <label htmlFor="chkRememberMe" className="ml-2">{t('login.remember-me')}</label>
                                   </div>
                                   <div className='forgotpassword-section'>
                                        <Link to="/account/forgotpassword">{t('login.forgot-password')}</Link>
                                   </div>
                              </div>
                              <div className="login-intro-x pt-3">
                                   <Button id="btnLogin" onClick={() => navigate('/dashboard')}> {t('login.Login')} </Button>
                              </div>
                              <div className='login-intro-x terms-section'>
                                   <span>{t('login.knows-our')} <a href="#">{t('login.terms-and-conditions')}</a> - <a href="#">{t('login.privacy-police')}</a></span>
                              </div>
                         </div>
                    </div>
               </div>
          </div>
     )
}
export default Login