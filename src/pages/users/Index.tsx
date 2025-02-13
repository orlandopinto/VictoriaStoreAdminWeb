//import { useTranslation } from "react-i18next";
import { AxiosError } from 'axios';
import { FilterMatchMode } from "primereact/api";
import { Sidebar } from "primereact/sidebar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Column, confirmDialog, ConfirmDialog, DataTable, DataTableFilterMeta, Dialog, IconField, InputIcon, InputText } from '../../components/primereact/index';
import { ACTIONS } from '../../config/constants.d';
import { UserController } from "../../controllers/user.controller";
import { useAuth } from "../../hooks";
import { AuthProfile, UserPermission } from "../../types";

const IndexUser = () => {
     //WARNING: las siguientes lineas son obligatiorias para ejecutar los permisos
     //..:: [ WARNING: las siguientes lineas son obligatiorias para ejecutar los permisos ]::..
     const [resourse] = useState('users')
     const { authProfile, getPermission, isAllowed } = useAuth();
     const permissions = getPermission(resourse) as unknown as UserPermission;
     const [permission] = useState(permissions)
     //..::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..

     const [userList, setUserList] = useState<AuthProfile[]>([])
     const [loading, setLoading] = useState<boolean>(true);
     const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
     const [visibleRight, setVisibleRight] = useState<boolean>(false);
     const [dialogVisible, setDialogVisible] = useState(false);

     const [filters, setFilters] = useState<DataTableFilterMeta>({
          global: { value: null, matchMode: FilterMatchMode.CONTAINS },
          name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
          'email': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
          representative: { value: null, matchMode: FilterMatchMode.IN },
          status: { value: null, matchMode: FilterMatchMode.EQUALS },
          verified: { value: null, matchMode: FilterMatchMode.EQUALS }
     });

     const navigate = useNavigate();
     //const { t } = useTranslation();
     const controller = new UserController(authProfile?.token as string)

     useEffect(() => {
          if (!isAllowed(resourse)) {
               navigate('/errors/403')
          }
          getData()
     }, [])

     const getData = async () => {
          try {
               const data = await controller.GetUsers();
               const profileList: AuthProfile[] = data as unknown as AuthProfile[]
               setUserList(profileList)
               setLoading(false)
          } catch (err) {
               console.log('error: ', err)
               const error = err as unknown as AxiosError
               const errorMessage = (error?.response?.data as any).error
               if (errorMessage === 'Invalid Bearer token') {
                    deleteAlertConfirm();
               }
          }
     }

     const lockoutEnabledBodyTemplate = (user: any) => {
          return user.lockoutEnabled;
     };

     const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value;
          let _filters = { ...filters };
          // @ts-ignore
          _filters['global'].value = value;
          setFilters(_filters);
          setGlobalFilterValue(value);
     };

     const renderHeader = () => {
          return (
               <div className="flex justify-content-between">
                    <span className="text-2xl">Users</span>
                    <div className="flex justify-content-between align-items-center gap-2">
                         <IconField iconPosition="left">
                              <InputIcon className="pi pi-search" />
                              <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar" className="p-inputtext-sm" />
                         </IconField>
                         {permission && permission.actions.includes(ACTIONS.CREATE) && <Button icon="pi pi-plus" label="Nuevo"></Button>}
                         <Button icon="pi pi-external-link" style={{ cursor: 'pointer', fontSize: '1.5rem' }} onClick={() => setDialogVisible(true)} />
                    </div>
               </div>
          );
     };

     const optionsBodyTemplate = () => {
          return (
               <div className="flex justify-content-end gap-2">
                    {permission && permission.actions.includes(ACTIONS.VIEW) && <i className="pi pi-eye" style={{ fontSize: '1.2rem', cursor: 'pointer' }}></i>}
                    {permission && permission.actions.includes(ACTIONS.UPDATE) && <i className="pi pi-user-edit" style={{ fontSize: '1.2rem', cursor: 'pointer' }} onClick={() => setVisibleRight(true)}></i>}
                    {permission && permission.actions.includes(ACTIONS.DELETE) && <i className="pi pi-trash" style={{ fontSize: '1.2rem', cursor: 'pointer' }} onClick={deleteAlertConfirm}></i>}
               </div>
          );
     }

     const dialogFooterTemplate = () => {
          return <Button label="Cerrar" icon="pi pi-check" onClick={() => setDialogVisible(false)} />;
     };

     const deleteAlertConfirm = () => {
          confirmDialog({
               group: 'headless',
               message: 'Are you sure you want to proceed?',
               header: 'Confirmation',
               icon: 'pi pi-exclamation-triangle',
               defaultFocus: 'accept',
               //accept,
               //reject
          });
     };

     return (
          <>
               {permission && permission.actions.includes(ACTIONS.LIST) &&
                    (
                         <Card>
                              <DataTable
                                   value={userList}
                                   header={renderHeader}
                                   // scrollable
                                   // scrollHeight="400px"
                                   filters={filters}
                                   onFilter={(e) => setFilters(e.filters)}
                                   //selection={selectedUserValue}
                                   //onSelectionChange={(e) => setSelectedUserValue(e.value as AuthProfile)}
                                   emptyMessage="No users found."
                                   sortField="email"
                                   sortOrder={-1}
                                   paginator
                                   rowsPerPageOptions={[10, 25, 50]}
                                   paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                   currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                                   rows={10}
                                   dataKey="_id"
                                   loading={loading}
                                   tableStyle={{ minWidth: '50rem' }}
                              >
                                   <Column field="email" header="email" sortable />
                                   <Column field="lockoutEnabled" header="lockoutEnabled" body={lockoutEnabledBodyTemplate} sortable />
                                   <Column field="userName" header="userName" sortable />
                                   <Column headerStyle={{ width: '5rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={optionsBodyTemplate} />
                              </DataTable>
                              <Dialog header="Flex Scroll" visible={dialogVisible} style={{ width: '75vw' }} maximizable
                                   modal contentStyle={{ height: '300px' }} onHide={() => setDialogVisible(false)} footer={dialogFooterTemplate}>
                                   <DataTable value={userList} scrollable scrollHeight="flex" tableStyle={{ minWidth: '50rem' }}>
                                        <Column field="email" header="email" sortable />
                                        <Column field="lockoutEnabled" header="lockoutEnabled" body={lockoutEnabledBodyTemplate} sortable />
                                        <Column field="userName" header="userName" sortable />
                                        <Column headerStyle={{ width: '5rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={optionsBodyTemplate} />
                                   </DataTable>
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
                                   group="headless"
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
                         </Card>
                    )}
          </>
     )
}
export default IndexUser