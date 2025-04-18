import { Badge } from 'primereact/badge';
import { Divider } from 'primereact/divider';
import { Menu } from 'primereact/menu';
import { Menubar } from 'primereact/menubar';
import { Ripple } from 'primereact/ripple';
import { Toast } from 'primereact/toast';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/svg/logo.svg';
import { useAuth } from '../../hooks';
import SwitchLanguages from './LanguageSwitcher';
import './navigation.css';
import AppSideBar from './AppSideBar';
import ThemeSelection from './ThemeSelection';
import { CLOUDINARY_NAME } from '../../config/envs.d';

const Navigation = () => {
     const toast = useRef(null);
     const { logout, userLoggedData } = useAuth()
     const [visible, setVisible] = useState(false);

     const barsItemRenderer = (item: any) => {
          return (
               <Link to="" onClick={() => setVisible(true)} className="flex align-items-center p-menuitem-link p-3">
                    <span className={item.icon} />
                    <Ripple />
               </Link>
          )
     };

     const dashboardItemRenderer = (item: any) => (
          <Link to="/dashboard" className="flex align-items-center p-menuitem-link p-3">
               <span className={item.icon} />
               <span className="mx-2">{item.label}</span>
               <Ripple />
          </Link>
     );

     const taxesItemRenderer = (item: any) => (
          <Link to="/taxes" className="flex align-items-center p-menuitem-link  p-3">
               <span className={item.icon} />
               <span className="mx-2">{item.label}</span>
               <Ripple />
          </Link>
     );

     const discountsItemRenderer = (item: any) => (
          <Link to="/discounts" className="flex align-items-center p-menuitem-link p-3">
               <span className={item.icon} />
               <span className="mx-2">{item.label}</span>
               <Ripple />
          </Link>
     );

     const logoutItemRenderer = (item: any) => (
          <a href="/" onClick={() => logout()} className="flex align-items-center p-menuitem-link p-3">
               <span className={item.icon} />
               <span className="mx-2">{item.label}</span>
               <Ripple />
          </a>
     );

     //Generico para efectos del menu projects
     const itemRenderer = (item: any) => (
          <Link to="/dashboard" className="flex align-items-center p-menuitem-link">
               <span className={item.icon} />
               <span className="mx-2">{item.label}</span>
               <Ripple />
          </Link>
     );

     const items = [
          {
               icon: 'pi pi-bars',
               template: barsItemRenderer
          },
          // {
          //      label: 'Dashboard',
          //      icon: 'pi pi-th-large',
          //      template: dashboardItemRenderer
          // },
          // {
          //      label: 'Taxes',
          //      icon: 'pi pi-wallet',
          //      path: '/taxes',
          //      template: taxesItemRenderer
          // },
          // {
          //      label: 'Discounts',
          //      icon: 'pi pi-envelope',
          //      badge: 3,
          //      template: discountsItemRenderer
          // },
          // {
          //      label: 'Projects',
          //      icon: 'pi pi-search',
          //      items: [
          //           {
          //                label: 'Core',
          //                icon: 'pi pi-bolt',
          //                shortcut: '⌘+S',
          //                template: itemRenderer
          //           },
          //           {
          //                label: 'Blocks',
          //                icon: 'pi pi-server',
          //                shortcut: '⌘+B',
          //                template: itemRenderer
          //           },
          //           {
          //                label: 'UI Kit',
          //                icon: 'pi pi-pencil',
          //                shortcut: '⌘+U',
          //                template: itemRenderer
          //           },
          //           {
          //                separator: true
          //           },
          //           {
          //                label: 'Templates',
          //                icon: 'pi pi-palette',
          //                items: [
          //                     {
          //                          label: 'Apollo',
          //                          icon: 'pi pi-palette',
          //                          badge: 2,
          //                          template: itemRenderer
          //                     },
          //                     {
          //                          label: 'Ultima',
          //                          icon: 'pi pi-palette',
          //                          badge: 3,
          //                          template: itemRenderer
          //                     }
          //                ]
          //           }
          //      ]
          // }
     ];

     const profileHederMenuItemRenderer = () => (
          <div className='text-center pt-2 gap'>
               <div className='pb-2'>
                    <img src={`https://res.cloudinary.com/${CLOUDINARY_NAME}/image/upload/co_skyblue,e_outline/e_shadow,x_5,y_8/c_fill,g_center,h_70,w_70/${userLoggedData?.userData.public_id}`} alt="" onClick={(event) => menuLeft.current?.toggle(event)} />
               </div>
               <h5 className='my-1'>{`${userLoggedData?.userData.firstName} ${userLoggedData?.userData.lastName}`}</h5>
               <p style={{ fontSize: '.8rem' }}>{userLoggedData?.userData.roles[0]}</p>
               <Divider />
          </div>
     );

     const dividerItemRenderer = () => (
          <Divider />
     )

     const start = (
          <div className='flex align-items-center pr-3'>
               <div><img alt="logo" src={logo} height="35" className="mr-2"></img></div>
               <div style={{ fontSize: '1.6rem' }}>Victoria Store</div>
          </div>)

     const menuLeft = useRef<Menu>(null);
     const menuItemsProfile = [
          {
               label: '',
               items: [
                    {
                         template: profileHederMenuItemRenderer
                    },
                    {
                         label: 'Mi Perfil',
                         icon: 'pi pi-th-large',
                         template: dashboardItemRenderer
                    },
                    {
                         label: 'Taxes',
                         icon: 'pi pi-wallet',
                         path: '/taxes',
                         template: taxesItemRenderer
                    },
                    {
                         template: dividerItemRenderer
                    },
                    {
                         label: 'Logout',
                         icon: 'pi pi-envelope',
                         badge: 3,
                         template: logoutItemRenderer
                    }
               ]
          }
     ];
     const end = (
          <div className="flex align-items-center gap-2">
               {/* <IconField iconPosition="left">
                    <InputIcon className="pi pi-search"> </InputIcon>
                    <InputText placeholder="Buscar" className="p-inputtext-sm" />
               </IconField> */}
               <ThemeSelection />
               <div className="flex justify-content-center">
                    <div className="flex flex-wrap justify-content-center gap-4 align-items-center px-4" >
                         <i className="pi pi-bell p-overlay-badge" >
                              <Badge value="2"></Badge>
                         </i>
                         <i className="pi pi-calendar p-overlay-badge">
                              <Badge value="5" severity="danger"></Badge>
                         </i>
                         <i className="pi pi-envelope p-overlay-badge" >
                              <Badge severity="danger" size={'normal'}></Badge>
                         </i>
                    </div>
                    <SwitchLanguages />
               </div>
               <div className="flex justify-content-center">
                    <Menu model={menuItemsProfile} popup ref={menuLeft} id="popup-avatar-profile" />
                    <img src={`https://res.cloudinary.com/${CLOUDINARY_NAME}/image/upload/co_skyblue,e_outline/e_shadow,x_5,y_8/c_fill,g_center,h_35,w_35/${userLoggedData?.userData.public_id}`} alt="" onClick={(event) => menuLeft.current?.toggle(event)} style={{ cursor: 'pointer' }} />
               </div>
          </div>
     );

     const getWindowPathName = () => {
          return window.location.pathname
     }

     return (
          <>
               <AppSideBar visible={visible} setVisible={setVisible} windowPathName={getWindowPathName()} />
               <Menubar id="NavBar" model={items} start={start} end={end} />
               <Toast ref={toast} />
          </>
     )
}

export default Navigation