import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';
import { Divider } from 'primereact/divider';
import { Menu } from 'primereact/menu';
import { Menubar } from 'primereact/menubar';
import { Ripple } from 'primereact/ripple';
import { Toast } from 'primereact/toast';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import foto from '../../assets/images/Orlando.png';
import logo from '../../assets/svg/logo.svg';
import SwitchLanguages from './LanguageSwitcher';
import './navigation.css';
import SideBar from './SideBar';
import ThemeSelection from './ThemeSelection';

const Navigation = () => {
     const toast = useRef(null);
     const [visible, setVisible] = useState(false);

     // const sidebarItemRenderer = (item: any) => (
     //      <a className="flex align-items-center p-menuitem-link">
     //           <span className={item.icon} />
     //      </a>
     // );

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
          </Link>
     );

     const discountsItemRenderer = (item: any) => (
          <Link to="/discounts" className="flex align-items-center p-menuitem-link p-3">
               <span className={item.icon} />
               <span className="mx-2">{item.label}</span>
          </Link>
     );

     const itemRenderer = (item: any) => (
          <Link to="/dashboard" className="flex align-items-center p-menuitem-link">
               <span className={item.icon} />
               <span className="mx-2">{item.label}</span>
          </Link>
     );

     const items = [
          {
               icon: 'pi pi-bars',
               command: () => {
                    //toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No printer connected', life: 3000 });
                    setVisible(true)
               }
          },
          {
               label: 'Dashboard',
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
               label: 'Discounts',
               icon: 'pi pi-envelope',
               badge: 3,
               template: discountsItemRenderer
          },
          {
               label: 'Projects',
               icon: 'pi pi-search',
               items: [
                    {
                         label: 'Core',
                         icon: 'pi pi-bolt',
                         shortcut: '⌘+S',
                         template: itemRenderer
                    },
                    {
                         label: 'Blocks',
                         icon: 'pi pi-server',
                         shortcut: '⌘+B',
                         template: itemRenderer
                    },
                    {
                         label: 'UI Kit',
                         icon: 'pi pi-pencil',
                         shortcut: '⌘+U',
                         template: itemRenderer
                    },
                    {
                         separator: true
                    },
                    {
                         label: 'Templates',
                         icon: 'pi pi-palette',
                         items: [
                              {
                                   label: 'Apollo',
                                   icon: 'pi pi-palette',
                                   badge: 2,
                                   template: itemRenderer
                              },
                              {
                                   label: 'Ultima',
                                   icon: 'pi pi-palette',
                                   badge: 3,
                                   template: itemRenderer
                              }
                         ]
                    }
               ]
          }
     ];

     const avatarItemRenderer = () => (
          <div className='text-center pt-2 gap'>
               <div>
                    <Avatar
                         image={foto}
                         id="avatarFoto"
                         shape="circle"
                         style={{ width: 70, height: 70 }}
                    />
               </div>
               <h5 className='my-1'>Orlando Pinto</h5>
               <p style={{ fontSize: '.8rem' }}>Adminstrador</p>
               <Divider />
          </div>
     );

     const dividerItemRenderer = () => (
          <Divider />
     )

     const start = (
          <div className='flex align-items-center pr-3'>
               <div>
                    <img alt="logo" src={logo} height="35" className="mr-2"></img>
               </div>
               <div style={{ fontSize: '1.6rem' }}>
                    Victoria Store
               </div>
          </div>)

     const menuLeft = useRef<Menu>(null);
     const items2 = [
          {
               label: '',
               items: [
                    {
                         template: avatarItemRenderer
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
                         template: discountsItemRenderer
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
               <div>
                    <ThemeSelection />
               </div>
               <div className="flex justify-content-center">
                    <Menu model={items2} popup ref={menuLeft} id="popup-avatar-profile" />
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
                    <Menu model={items2} popup ref={menuLeft} id="popup-avatar-profile" />
                    <Avatar
                         image={foto}
                         id="avatar"
                         shape="circle"
                         label="Show Left"
                         icon="pi pi-align-left"
                         className="mr-2"
                         onClick={(event) => menuLeft.current?.toggle(event)}
                         aria-controls="popup_menu_left"
                         aria-haspopup
                    />
               </div>
          </div>
     );

     return (
          <>
               <SideBar visible={visible} setVisible={setVisible} />
               <Menubar id="NavBar" model={items} start={start} end={end} />
               <Toast ref={toast} />
          </>
     )
}

export default Navigation