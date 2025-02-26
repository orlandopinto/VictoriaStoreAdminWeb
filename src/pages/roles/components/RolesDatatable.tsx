import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTableFilterMeta, DataTable } from "primereact/datatable";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Dispatch, SetStateAction, useState } from "react";
import { ACTIONS } from "../../../config/constants.d";
import { PermissionsByRole, Roles } from "../../../types";
import { useAuth } from "../../../hooks";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

interface Props {
     rolesData: Roles[];
     permissionsByRole: PermissionsByRole[];
     loading: boolean;
     setVisibleRight: Dispatch<SetStateAction<boolean>>;
     setStepperDialogVisible: Dispatch<SetStateAction<boolean>>;
}

const RolesDatatable = ({ rolesData, permissionsByRole, loading, setVisibleRight, setStepperDialogVisible }: Props) => {

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

     const rolesOptionsBodyTemplate = () => {
          return (
               <div className="flex justify-content-end gap-2">
                    {permissionsByRole.length > 0 && hasAction(ACTIONS.EDIT) && <i className="pi pi-pencil" style={{ fontSize: '1.2rem', cursor: 'pointer' }} onClick={() => setVisibleRight(true)}></i>}
                    {permissionsByRole.length > 0 && hasAction(ACTIONS.DELETE) && <i className="pi pi-trash" style={{ fontSize: '1.2rem', cursor: 'pointer' }} onClick={deleteAlertConfirm}></i>}
               </div>
          );
     }

     const rolesRenderHeader = () => {
          return (
               <div className="flex justify-content-between pt2">
                    <div>
                         <IconField iconPosition="left">
                              <InputIcon className="pi pi-search" />
                              <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar" className="p-inputtext-sm" />
                         </IconField>
                    </div>
                    <div>
                         <Button icon={"pi pi-plus"} label="Nuevo rol" className="w-8rem" onClick={() => setStepperDialogVisible(true)}></Button>
                    </div>
               </div>
          );
     };
     return (
          <>
               <DataTable
                    className='dt-roles'
                    value={rolesData}
                    header={rolesRenderHeader}
                    filters={filters}
                    onFilter={(e) => setFilters(e.filters)}
                    emptyMessage="No users found."
                    sortField="email"
                    sortOrder={-1}
                    dataKey="_id"
                    loading={loading}
                    tableStyle={{ minWidth: '50rem' }}
               >
                    <Column field="roleName" header="Rol" sortable />
                    <Column headerStyle={{ width: '5rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={rolesOptionsBodyTemplate} />
               </DataTable>
               <ConfirmDialog
                    group="delete"
                    content={({ headerRef, contentRef, footerRef, hide, message }: any) => (
                         <div className="flex flex-column align-items-center p-5 surface-overlay border-round">
                              {/* <div className="border-circle bg-primary inline-flex justify-content-center align-items-center h-6rem w-6rem -mt-8">
                                   <i className="pi pi-question text-5xl"></i>
                              </div> */}
                              <span className="font-bold text-2xl block mb-2 mt-4" ref={headerRef}>
                                   {message.header}
                              </span>
                              <p className="mb-0" ref={contentRef}>
                                   {message.message}
                              </p>
                              <div className="flex align-items-center gap-2 mt-4" ref={footerRef}>
                                   <Button
                                        label="Eliminar"
                                        severity="danger"
                                        onClick={(event) => {
                                             hide(event);
                                             //accept();
                                        }}
                                        className="w-8rem"
                                   ></Button>
                                   <Button
                                        label="Cancelar"
                                        severity="danger"
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


export default RolesDatatable;