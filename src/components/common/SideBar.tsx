
import { Avatar } from 'primereact/avatar';
import { Ripple } from 'primereact/ripple';
import { Sidebar } from 'primereact/sidebar';
import { StyleClass } from 'primereact/styleclass';
import { Dispatch, SetStateAction, useRef } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/svg/logo.svg';
import profilePicture from '../../assets/images/Orlando.png'
import './sidebar.css';

interface Props {
     visible: boolean
     setVisible: Dispatch<SetStateAction<boolean>>
}

export default function SideBar({ visible, setVisible }: Props) {
     const btnRef2 = useRef<any>(null);
     const btnRef3 = useRef<any>(null);

     const closeSideBar = () => {
          setVisible(false)
     }

     return (
          <Sidebar
               closeOnEscape={true}
               visible={visible}
               onHide={() => setVisible(false)}
               content={({ hide }) => (
                    <div className="min-h-screen flex relative lg:static surface-ground">
                         <div className="min-h-screen flex relative lg:static surface-ground">
                              <div id="app-sidebar" className="surface-section h-screen block flex-shrink-0 absolute lg:static left-0 top-0 z-1 border-right-1 surface-border select-none" style={{ width: '280px' }}>
                                   <div className="flex flex-column h-full">
                                        <div className="flex align-items-center justify-content-between flex-shrink-0 pb-2">
                                             <img alt="logo" src={logo} height="35" className="mr-2"></img>
                                             <span className="inline-flex align-items-center gap-2">
                                                  <span className="font-semibold text-2xl text-primary">Victoria Store</span>
                                             </span>
                                             <span>
                                                  <i className='close-menu-side-bar pi pi-times' onClick={(e) => hide(e)} style={{ cursor: 'pointer', background: '#e0e0e0e', borderRadius: '50%', padding: '1rem', color: '#000' }} />
                                             </span>
                                        </div>
                                        <div className="overflow-y-auto pt-4">
                                             <ul className="list-none p-0 m-0">
                                                  <li>
                                                       <ul className="list-none p-0 m-0 overflow-hidden">
                                                            <li>
                                                                 <Link to="/dashboard" onClick={closeSideBar} className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                                                                      <i className="pi pi-th-large mr-2"></i>
                                                                      <span className="font-medium">Dashboard</span>
                                                                      <Ripple />
                                                                 </Link>
                                                            </li>
                                                            <li>
                                                                 <Link to="/taxes" onClick={closeSideBar} className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                                                                      <i className="pi pi-wallet mr-2"></i>
                                                                      <span className="font-medium">Taxes</span>
                                                                      <Ripple />
                                                                 </Link>
                                                            </li>
                                                            <li>
                                                                 <Link to="/discounts" onClick={closeSideBar} className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                                                                      <i className="pi pi-money-bill mr-2"></i>
                                                                      <span className="font-medium">Discounts</span>
                                                                      <Ripple />
                                                                 </Link>
                                                            </li>
                                                            <li>
                                                                 <Link to="/users" onClick={closeSideBar} className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                                                                      <i className="pi pi-users mr-2"></i>
                                                                      <span className="font-medium">Users</span>
                                                                      <Ripple />
                                                                 </Link>
                                                            </li>
                                                            <li>
                                                                 <Link to="/roles" onClick={closeSideBar} className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                                                                      <i className="pi pi-lock mr-2"></i>
                                                                      <span className="font-medium">Roles and Permissions</span>
                                                                      <Ripple />
                                                                 </Link>
                                                            </li>
                                                            <li>
                                                                 <StyleClass nodeRef={btnRef2} selector="@next" enterFromClassName="hidden" enterActiveClassName="slidedown" leaveToClassName="hidden" leaveActiveClassName="slideup">
                                                                      <a ref={btnRef2} className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                                                                           <i className="pi pi-chart-line mr-2"></i>
                                                                           <span className="font-medium">Reports</span>
                                                                           <i className="pi pi-chevron-down ml-auto mr-1"></i>
                                                                           <Ripple />
                                                                      </a>
                                                                 </StyleClass>
                                                                 <ul className="list-none py-0 pl-3 pr-0 m-0 hidden overflow-y-hidden transition-all transition-duration-400 transition-ease-in-out">
                                                                      <li>
                                                                           <StyleClass nodeRef={btnRef3} selector="@next" enterFromClassName="hidden" enterActiveClassName="slidedown" leaveToClassName="hidden" leaveActiveClassName="slideup">
                                                                                <a ref={btnRef3} className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                                                                                     <i className="pi pi-chart-line mr-2"></i>
                                                                                     <span className="font-medium">Revenue</span>
                                                                                     <i className="pi pi-chevron-down ml-auto mr-1"></i>
                                                                                     <Ripple />
                                                                                </a>
                                                                           </StyleClass>
                                                                           <ul className="list-none py-0 pl-3 pr-0 m-0 hidden overflow-y-hidden transition-all transition-duration-400 transition-ease-in-out">
                                                                                <li>
                                                                                     <a className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                                                                                          <i className="pi pi-table mr-2"></i>
                                                                                          <span className="font-medium">View</span>
                                                                                          <Ripple />
                                                                                     </a>
                                                                                </li>
                                                                                <li>
                                                                                     <a className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                                                                                          <i className="pi pi-search mr-2"></i>
                                                                                          <span className="font-medium">Search</span>
                                                                                          <Ripple />
                                                                                     </a>
                                                                                </li>
                                                                           </ul>
                                                                      </li>
                                                                      <li>
                                                                           <a className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                                                                                <i className="pi pi-chart-line mr-2"></i>
                                                                                <span className="font-medium">Expenses</span>
                                                                                <Ripple />
                                                                           </a>
                                                                      </li>
                                                                 </ul>
                                                            </li>
                                                            <li>
                                                                 <a onClick={closeSideBar} className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                                                                      <i className="pi pi-comments mr-2"></i>
                                                                      <span className="font-medium">Messages</span>
                                                                      <span className="inline-flex align-items-center justify-content-center ml-auto bg-blue-500 text-0 border-circle" style={{ minWidth: '1.5rem', height: '1.5rem' }}>
                                                                           3
                                                                      </span>
                                                                      <Ripple />
                                                                 </a>
                                                            </li>
                                                            <li>
                                                                 <a onClick={closeSideBar} className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                                                                      <i className="pi pi-calendar mr-2"></i>
                                                                      <span className="font-medium">Calendar</span>
                                                                      <Ripple />
                                                                 </a>
                                                            </li>
                                                            <li>
                                                                 <a onClick={closeSideBar} className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                                                                      <i className="pi pi-cog mr-2"></i>
                                                                      <span className="font-medium">Settings</span>
                                                                      <Ripple />
                                                                 </a>
                                                            </li>
                                                       </ul>
                                                  </li>
                                             </ul>
                                        </div>
                                        <div className="mt-auto">
                                             <hr className="mb-3 mx-3 border-top-1 border-none surface-border" />
                                             <a className="m-3 flex align-items-center cursor-pointer p-3 gap-2 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple">
                                                  <Avatar image={profilePicture} shape="circle" />
                                                  <span className="font-bold">Orlando Pinto</span>
                                             </a>
                                        </div>
                                   </div>
                              </div>
                         </div>
                    </div>
               )}
          >
          </Sidebar>
     )
}
