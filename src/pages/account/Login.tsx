import { SyntheticEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from "react-i18next";
import { Form, Link, useNavigate } from 'react-router-dom';
import ukflag from '../../assets/flags/en-flag.svg';
import esflag from '../../assets/flags/es-flag.svg';
import loginImage from '../../assets/svg/login.svg';
import logo from '../../assets/svg/logo.svg';
import { Avatar, Button, Checkbox, CheckboxChangeEvent, ConfirmDialog, confirmDialog, IconField, InputIcon, InputText, ListBox, ListBoxChangeEvent, OverlayPanel } from '../../components/primereact/index';
import { AuthController } from '../../controllers/auth.controller';
import { PermissionController } from '../../controllers/permission.controller';
import { useAuth } from '../../hooks';
import useLanguages from '../../hooks/useLanguages';
import { ApiResultResponse, Language, Permissions } from '../../types';
import { Validators } from '../../utils/Validators';
import './login.css';
import { AxiosError } from 'axios';

function Login() {

     const { t } = useTranslation();
     const navigate = useNavigate();
     const [email, setEmail] = useState<string>('');
     const [password, setPassword] = useState<string>('');
     const [checked, setChecked] = useState(false);
     const [validated, setValidated] = useState(false);
     const { storeSessionData, isAuthenticated } = useAuth()
     const [loading, setLoading] = useState<boolean>(false);

     useEffect(() => {
          //TODO: Hay que esperar que caduque el token para ver si redirecciona
          if (isAuthenticated())
               navigate('/dashboard')
     }, [])

     const [languages, changeLanguage, selectedLanguage, setSelectedLanguage] = useLanguages(esflag, ukflag) as any;
     const languageOptionRef = useRef<OverlayPanel>(null);

     const languagesTemplate = (option: Language) => {
          return (<img alt={option.locale} src={option.img === 'ukflag' ? ukflag : esflag} style={{ width: '2rem' }} />);
     };

     const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
          e.preventDefault();
          if (e.currentTarget.checkValidity() === false) {
               setValidated(true);
          }
          else {
               await onLogin();
          }
     }

     const onLogin = async () => {
          try {
               setLoading(true)

               if (!Validators.email.test(email)) {
                    errorAlert('Email is not valid')
                    return
               }
               const apiResultResponse = await AuthController.Login(email, password) as unknown as ApiResultResponse
               if (apiResultResponse.hasError) {
                    const err = apiResultResponse.errorMessage
                    console.log('err: ', err)
                    if (err && err.length > 0) {
                         errorAlert(err)
                    }
                    return
               }
               const permissions = await getPermission(apiResultResponse.data.token) as unknown as Permissions[]

               storeSessionData(apiResultResponse.data, permissions);
               navigate('/dashboard')
          } catch (error) {
               setLoading(false);
               const handledError = (error as AxiosError).response?.data as Record<string, string>
               errorAlert(handledError.error)
          }
          finally {
               setLoading(false);
          }
     }

     const getPermission = async (token: string): Promise<Permissions[]> => {
          try {
               const result = await new PermissionController(token).Get() as unknown as ApiResultResponse
               if (result.hasError) {
                    const err = result.errorMessage
                    console.log('err: ', err)
                    if (err && err.length > 0) {
                         errorAlert(err)
                    }
               }
               return result.data as unknown as Permissions[]
          } catch (error) {
               const handledError = (error as AxiosError).response?.data as Record<string, string>
               errorAlert(handledError.error)
          }
          return [] as unknown as Permissions[]
     }

     const errorAlert = (message: string) => {
          confirmDialog({
               group: 'headless',
               message: message,
               header: 'Error',
               icon: 'pi pi-info-circle',
               defaultFocus: 'accept'
          });
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
                                                  localStorage.setItem('lang', e.value.locale)
                                                  changeLanguage(e.value.locale)
                                             }
                                        }}
                                        options={languages}
                                        optionLabel="name"
                                        className="language-list" />
                              </OverlayPanel>
                         </div>
                         <Form noValidate onSubmit={handleSubmit}>
                              <div className="login-controls">
                                   <div className="login-intro-x font-medium text-4xl pb-5">
                                        <span>{t('login.sign-in')}</span>
                                   </div>
                                   <div className="login-intro-x mt-3 text-lg">
                                        <IconField iconPosition="left">
                                             <InputIcon className="pi pi-user" />
                                             <InputText
                                                  id="email"
                                                  name="email"
                                                  autoComplete='email'
                                                  placeholder={t('login.placeholder-email')}
                                                  value={email}
                                                  className={validated === true && email === '' ? "p-invalid" : ""}
                                                  required={true}
                                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} >
                                             </InputText>
                                        </IconField>
                                        {validated === true && email === '' ? <p className='invalid-field'> <i className="pi pi-exclamation-triangle" />  Email is required</p> : ""}
                                   </div>
                                   <div className="login-intro-x mt-3 text-lg">
                                        <IconField iconPosition="left">
                                             <InputIcon className="pi pi-lock" />
                                             <InputText
                                                  id="password"
                                                  name="password"
                                                  placeholder={t('login.password')}
                                                  type="password"
                                                  value={password}
                                                  className={validated === true && password === '' ? "p-invalid" : ""}
                                                  required={true}
                                                  autoComplete='current-password'
                                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />
                                        </IconField>
                                        {validated === true && password === '' ? <p className='invalid-field'> <i className="pi pi-exclamation-triangle" />  Password is required</p> : ""}
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
                                        <Button icon="pi pi-check" id="btnLogin" loading={loading}><span className='pl-3'>{t('login.Login')}</span> </Button>
                                   </div>
                                   <div className='login-intro-x terms-section text-center'>
                                        <span>{t('login.knows-our')} <a href="#">{t('login.terms-and-conditions')}</a> - <a href="#">{t('login.privacy-police')}</a></span>
                                   </div>
                              </div>
                         </Form>
                    </div>
               </div>
               <ConfirmDialog
                    className='error-dialog'
                    group="headless"
                    content={({ headerRef, contentRef, hide, message }) => (
                         <div className="flex flex-column align-items-center p-5 surface-overlay border-round">
                              <div className="border-circle bg-red inline-flex justify-content-center align-items-center h-6rem w-6rem -mt-8">
                                   <i className="pi pi-times text-5xl"></i>
                              </div>
                              <span className="font-bold text-2xl block mb-2 mt-4" ref={headerRef}>
                                   {message.header}
                              </span>
                              <span className="mb-0" ref={contentRef}>
                                   {message.message}
                              </span>
                              <div className="flex align-items-center gap-2 mt-4">
                                   <Button label="Aceptar" onClick={(event) => { hide(event) }} className="w-8rem" />
                              </div>
                         </div>
                    )}
               />
          </div>
     )
}
export default Login