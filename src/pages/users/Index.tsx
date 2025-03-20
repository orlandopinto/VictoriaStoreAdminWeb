import { AxiosError } from 'axios';
import { Sidebar } from "primereact/sidebar";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button, Card, confirmDialog, ConfirmDialog, Dialog } from '../../components/primereact/index';
import { ACTIONS } from '../../config/constants.d';
import { UserController } from "../../controllers/user.controller";
import { useAuth } from "../../hooks";
import { PermissionsByRole, UserData } from "../../types";
import UsersDataTable from './UsersDataTable';
import "./index.css";

const IndexUser = () => {
     //..:: [ VARIABLES ] ::..

     //..:: [ HOOKS ] ::..
     //WARNING: ..:: [ Las siguientes lineas son obligatiorias para ejecutar los permisos ]::..
     const { userLoggedData, logout, hasAction, getPermissionList, isAllowed } = useAuth();
     const navigate = useNavigate();
     //..::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..

     useEffect(() => {
          getUsersData()
     }, [])

     const controller = new UserController(userLoggedData!)

     //..:: [ HOOKS ] ::..
     //const { t } = useTranslation();
     const [, setUserList] = useState<UserData[]>([])
     const [, setLoading] = useState<boolean>(true);
     const [visibleRight, setVisibleRight] = useState<boolean>(false);
     const [dialogVisible, setDialogVisible] = useState(false);
     const [permissionsByRole, setPermissionsByRole] = useState([] as PermissionsByRole[])

     //..:: [ FUNCTIONS ] ::..

     const getUsersData = async () => {
          try {
               if (!isAllowed(window.location.pathname.replace("/", ""))) {
                    navigate('/errors/403');
               }

               const data = await controller.GetUsers();
               setUserList(data as unknown as UserData[])
               const permissionsByRole = getPermissionList(window.location.pathname.replace("/", ""))
               setPermissionsByRole(permissionsByRole as PermissionsByRole[])
               setLoading(false)
          } catch (err) {
               console.log('error: ', err)
               const error = err as unknown as AxiosError
               if (error.message.includes('accessToken'))
                    alertModal();
          }
     }

     const dialogFooterTemplate = () => {
          return <Button label="Cerrar" icon="pi pi-check" onClick={() => setDialogVisible(false)} />;
     };

     // const deleteAlertConfirm = () => {
     //      confirmDialog({
     //           group: 'delete',
     //           message: 'Are you sure you want to proceed?',
     //           header: 'Confirmation',
     //           icon: 'pi pi-exclamation-triangle',
     //           defaultFocus: 'accept',
     //           //accept,
     //           //reject
     //      });
     // };

     const alertModal = () => {
          confirmDialog({
               group: 'alert',
               message: 'La session ha caducado, debe iniciar sesión nuevamente.',
               header: 'iniciar sesión',
               icon: 'pi pi-exclamation-triangle',
               defaultFocus: 'accept',
               //accept,
               //reject
          });
     };

     const redirect = () => {
          logout();
          <Navigate to="/" />
     }

     return (
          <>
               <div className='w-full pt-2 pb-3 flex justify-content-between align-items-center'>
                    <span className='text-2xl'>Users</span>
                    <div className='flex justify-content-between gap-2'>
                         <div>
                              {permissionsByRole.length > 0 && hasAction(ACTIONS.CREATE) && <Button icon="pi pi-plus" label="Nuevo"></Button>}
                         </div>
                         <div>
                              <Button icon="pi pi-external-link" style={{ cursor: 'pointer', fontSize: '1.5rem' }} onClick={() => setDialogVisible(true)} />
                         </div>
                    </div>
               </div>
               <Card>
                    <UsersDataTable />
                    <Dialog
                         header="Users"
                         visible={dialogVisible}
                         style={{ width: '75vw' }}
                         maximizable
                         modal
                         contentStyle={{ height: '300px' }}
                         onHide={() => setDialogVisible(false)}
                         footer={dialogFooterTemplate}
                    >
                         <UsersDataTable />
                    </Dialog>
                    <Sidebar
                         visible={visibleRight}
                         position="right"
                         onHide={() => setVisibleRight(false)}
                         //className="w-full md:w-20rem lg:w-30rem"
                         closeOnEscape
                    >
                         <h2>Editando usuario</h2>
                         <p>
                              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                         </p>
                    </Sidebar>
                    <ConfirmDialog
                         group="delete"
                         content={({ headerRef, contentRef, footerRef, hide, message }: any) => (
                              <div className="flex flex-column align-items-center p-5 surface-overlay border-round">
                                   <div className="border-circle bg-primary inline-flex justify-content-center align-items-center h-6rem w-6rem -mt-8">
                                        <i className="pi pi-question text-5xl"></i>
                                   </div>
                                   <span className="font-bold text-2xl block mb-2 mt-4" ref={headerRef}>
                                        {message.header}
                                   </span>
                                   <p className="mb-0" ref={contentRef}>
                                        {message.message}
                                   </p>
                                   <div className="flex align-items-center gap-2 mt-4" ref={footerRef}>
                                        <Button
                                             label="Save"
                                             onClick={(event) => {
                                                  hide(event);
                                                  //accept();
                                             }}
                                             className="w-8rem"
                                        ></Button>
                                        <Button
                                             label="Cancel"
                                             outlined
                                             onClick={(event) => {
                                                  hide(event);
                                                  //reject();
                                             }}
                                             className="w-8rem"
                                        ></Button>
                                   </div>
                              </div>
                         )}
                    />
                    <ConfirmDialog
                         group="alert"
                         content={({ headerRef, contentRef, footerRef, hide, message }: any) => (
                              <div className="flex flex-column align-items-center p-5 surface-overlay border-round">
                                   <div className="border-circle bg-primary inline-flex justify-content-center align-items-center h-6rem w-6rem -mt-8">
                                        <i className="pi pi-question text-5xl"></i>
                                   </div>
                                   <span className="font-bold text-2xl block mb-2 mt-4" ref={headerRef}>
                                        {message.header}
                                   </span>
                                   <p className="mb-0" ref={contentRef}>
                                        {message.message}
                                   </p>
                                   <div className="flex align-items-center gap-2 mt-4" ref={footerRef}>
                                        <Button
                                             label="Aceptar"
                                             onClick={(event) => {
                                                  hide(event);
                                                  redirect();
                                             }}
                                             className="w-8rem"
                                        ></Button>
                                   </div>
                              </div>
                         )}
                    />
               </Card>
          </>
     )
}

export default IndexUser