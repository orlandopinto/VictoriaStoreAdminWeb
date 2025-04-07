import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";
import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../hooks";
import ProductsDataTable from "./ProductsDataTable";
import './index.css'

const IndexProducts = () => {
     //..:: [ VARIABLES ] ::..

     //..:: [ HOOKS ] ::..
     //WARNING: ..:: [ Las siguientes lineas son obligatiorias para ejecutar los permisos ]::..
     const { logout, isAllowed } = useAuth();
     const navigate = useNavigate();

     //..:: [ HOOKS ] ::..
     const [dialogVisible, setDialogVisible] = useState(false);

     //..:: [ useEffect ] ::..
     useEffect(() => {
          if (!isAllowed(window.location.pathname.replace("/", ""))) {
               navigate('/errors/403')
          }
     }, [])

     //..:: [ FUNCTIONS ] ::..
     const dialogFooterTemplate = () => {
          return <Button label="Cerrar" icon="pi pi-check" onClick={() => setDialogVisible(false)} />;
     };

     const redirect = () => {
          logout();
          <Navigate to="/" />
     }

     return (
          <>
               <div className='w-full pt-2 pb-3 flex justify-content-between align-items-center'>
                    <span className='text-2xl'>Products</span>
                    <div className='flex justify-content-between gap-2'>
                         <Button icon="pi pi-external-link" style={{ cursor: 'pointer', fontSize: '1.5rem' }} onClick={() => setDialogVisible(true)} />
                    </div>
               </div>
               <Card>
                    <ProductsDataTable />
                    <Dialog
                         header="Products"
                         visible={dialogVisible}
                         style={{ width: '75vw' }}
                         maximizable
                         modal
                         contentStyle={{ height: '300px' }}
                         onHide={() => setDialogVisible(false)}
                         footer={dialogFooterTemplate}
                    >
                         <ProductsDataTable />
                    </Dialog>
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
export default IndexProducts