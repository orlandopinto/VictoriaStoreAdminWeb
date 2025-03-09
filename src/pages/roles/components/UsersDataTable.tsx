import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import { useEffect, useState } from "react";
import { ACTIONS } from "../../../config/constants.d";
import { useAuth } from "../../../hooks";
import { PermissionsByRole, UserData } from "../../../types";
import { useNavigate } from "react-router-dom";
import { UserController } from "../../../controllers";
import { AxiosError } from "axios";

const UsersDataTable = () => {
     const { getToken, logout, hasAction, getPermissionList, isAllowed } = useAuth();

     const [userList, setUserList] = useState<UserData[]>([])
     const [permissionsByRole, setPermissionsByRole] = useState([] as PermissionsByRole[])
     const [loading, setLoading] = useState<boolean>(true);
     const [, setVisibleRight] = useState<boolean>(false);
     const navigate = useNavigate();


     const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

     useEffect(() => {
          getData()
     }, [])

     const getData = async () => {
          if (!isAllowed(window.location.pathname.replace("/", ""))) {
               navigate('/errors/403')
          }

          setLoading(true)
          await loadUsersData();


          const permissionsByRole = getPermissionList(window.location.pathname.replace("/", ""))
          setPermissionsByRole(permissionsByRole as PermissionsByRole[])
          setLoading(false)
     }

     const loadUsersData = async () => {
          try {
               const controller = new UserController(getToken())
               const data = await controller.GetUsers();
               setUserList(data as unknown as UserData[])

          } catch (err) {
               console.log('error: ', err)
               const error = err as unknown as AxiosError
               const errorMessage = (error?.response?.data as any).error
               if (errorMessage === 'Invalid Bearer token') {
                    alertModal();
               }
          }
     }

     const alertModal = () => {
          confirmDialog({
               group: 'alert',
               message: 'La session ha caducado, debe iniciar sesión nuevamente.',
               header: 'iniciar sesión',
               icon: 'pi pi-exclamation-triangle',
               defaultFocus: 'accept'
          });
     };

     const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          e.preventDefault();
          const value = e.target.value;
          let _filters = { ...filters };
          // @ts-ignore
          _filters['global'].value = value;
          setFilters(_filters);
          setGlobalFilterValue(value);
     };
     //USER TAB
     const [filters, setFilters] = useState<DataTableFilterMeta>({
          global: { value: null, matchMode: FilterMatchMode.CONTAINS },
          name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
          'email': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
          representative: { value: null, matchMode: FilterMatchMode.IN },
          status: { value: null, matchMode: FilterMatchMode.EQUALS },
          verified: { value: null, matchMode: FilterMatchMode.EQUALS }
     });

     const deleteAlertConfirm = () => {
          confirmDialog({
               group: 'delete',
               message: 'Are you sure you want to proceed?',
               header: 'Confirmation',
               icon: 'pi pi-exclamation-triangle',
               defaultFocus: 'accept',
               //accept,
               //reject
          });
     };

     const renderHeader = () => {
          return (
               <div className="flex justify-content-end">
                    <IconField iconPosition="left">
                         <InputIcon className="pi pi-search" />
                         <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar" className="p-inputtext-sm" />
                    </IconField>
               </div>
          );
     };

     const optionsBodyTemplate = () => {
          return (
               <div className="flex justify-content-end gap-2">
                    {permissionsByRole.length > 0 && hasAction(ACTIONS.VIEW) && <i className="pi pi-eye" style={{ fontSize: '1.2rem', cursor: 'pointer' }}></i>}
                    {permissionsByRole.length > 0 && hasAction(ACTIONS.EDIT) && <i className="pi pi-pencil" style={{ fontSize: '1.2rem', cursor: 'pointer' }} onClick={() => setVisibleRight(true)}></i>}
                    {permissionsByRole.length > 0 && hasAction(ACTIONS.DELETE) && <i className="pi pi-trash" style={{ fontSize: '1.2rem', cursor: 'pointer' }} onClick={deleteAlertConfirm}></i>}
               </div>
          );
     }

     const rolesBodyTemplate = (user: any) => {
          let ctrls: any[] = [];
          user.roles.map((it: any, index: number) => {
               ctrls.push(<Tag key={index} className='mr-1'>{it}</Tag>)
          })

          return ctrls
     };

     const userNameBodyTemplate = (user: UserData) => {
          return (
               <div className="flex align-items-center gap-2">
                    <img alt={user.imageProfilePath} src={user.imageProfilePath} style={{ width: '28px' }} />
                    <span>{user.firstName} {user.lastName}</span>
               </div>
          );
     };

     const statusBodyTemplate = (user: UserData) => {
          return user.isActive ? <Tag value="Active" style={{ width: '60px' }} ></Tag> : <Tag severity="warning" value="Inactive" style={{ width: '60px' }}></Tag>
     }

     const redirect = () => {
          logout();
     }

     return (
          <>
               <DataTable
                    value={userList}
                    header={renderHeader}
                    filters={filters}
                    onFilter={(e) => setFilters(e.filters)}
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
                    <Column header="Name" sortable body={userNameBodyTemplate} />
                    <Column field="email" header="Email" sortable />
                    <Column field="phoneNumber" header="Phone number" sortable />
                    <Column field="roles" header="roles" body={rolesBodyTemplate} sortable />
                    <Column field="createdAt" header="Created at" sortable />
                    <Column field="isActive" header="Status" body={statusBodyTemplate} sortable />
                    <Column headerStyle={{ width: '5rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={optionsBodyTemplate} />
               </DataTable>
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
          </>
     )
}


export default UsersDataTable;