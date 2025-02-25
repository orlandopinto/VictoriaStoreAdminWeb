import { FilterMatchMode } from "primereact/api";
import { Column } from "primereact/column";
import { DataTableFilterMeta, DataTable } from "primereact/datatable";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import { Dispatch, SetStateAction, useState } from "react";
import { ACTIONS } from "../../../config/constants.d";
import { Permissions, UserData } from "../../../types";
import { useAuth } from "../../../hooks";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Button } from "primereact/button";

interface Props {
     userList: UserData[];
     permissions: Permissions[];
     loading: boolean;
     setVisibleRight: Dispatch<SetStateAction<boolean>>
}

const UsersDataTable = ({ userList, permissions, loading, setVisibleRight }: Props) => {

     const { hasAction } = useAuth();

     const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

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
                    {permissions.length > 0 && hasAction(ACTIONS.VIEW) && <i className="pi pi-eye" style={{ fontSize: '1.2rem', cursor: 'pointer' }}></i>}
                    {permissions.length > 0 && hasAction(ACTIONS.EDIT) && <i className="pi pi-user-edit" style={{ fontSize: '1.2rem', cursor: 'pointer' }} onClick={() => setVisibleRight(true)}></i>}
                    {permissions.length > 0 && hasAction(ACTIONS.DELETE) && <i className="pi pi-trash" style={{ fontSize: '1.2rem', cursor: 'pointer' }} onClick={deleteAlertConfirm}></i>}
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
                    <Column field="email" header="email" sortable />
                    <Column field="city" header="city" sortable />
                    <Column field="roles" header="roles" body={rolesBodyTemplate} sortable />
                    <Column headerStyle={{ width: '5rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={optionsBodyTemplate} />
               </DataTable>
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