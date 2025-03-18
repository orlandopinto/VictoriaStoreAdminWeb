import { AxiosError } from "axios";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { Sidebar } from "primereact/sidebar";
import { Toast } from "primereact/toast";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { PageController } from "../../controllers";
import { useAuth } from "../../hooks";
import { ApiResultResponse, Page } from "../../types";
import './index.css';

const PagesDataTable = () => {
     const { userLoggedData, getPermissionsProfileStateList, updatePermissionsProfile } = useAuth();

     const toast = useRef<Toast>(null);

     const inputTextRef = useRef<HTMLInputElement | null>(null);

     const [formData, setFormData] = useState<Page>({} as Page);
     const [pageList, setPageList] = useState<Page[]>([]);
     const [loading, setLoading] = useState<boolean>(true);
     const [showAlertModal, setShowAlertModal] = useState(false);
     const [overlayVisible, setOverlayVisible] = useState<boolean>(false);
     const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
     const [showRoleNameMessage, setShowRoleNameMessage] = useState(false);
     const [errorMessage, setErrorMessage] = useState('');
     const [showDeleteRoleModal, setShowDeleteRoleModal] = useState(false);
     const [selectedPage, setSelectedPage] = useState({} as Page);

     useEffect(() => {
          getData()
     }, [])

     const getData = async () => {
          setLoading(true)
          await loadPagesData();
          setLoading(false)
     }

     const loadPagesData = async () => {
          try {
               const controller = new PageController(userLoggedData!)
               const result = await controller.GetPages() as unknown as ApiResultResponse;
               if (result.hasError) {
                    const err = new Error(result.message);
                    alertModal(err);
                    return;
               }
               setPageList(result.data as unknown as Page[]);

          } catch (err) {
               console.log('error: ', err)
               const error = err as unknown as AxiosError
               const errorMessage = (error?.response?.data as any).error
               if (errorMessage === 'Invalid Bearer token') {
                    alertModal();
               }
          }
     }

     const alertModal = (err?: any) => {
          if (err) {
               confirmDialog({
                    group: 'alert',
                    message: err.errorMessage ? err.errorMessage : err.message,
                    header: 'Error',
                    icon: 'pi pi-exclamation-triangle',
                    defaultFocus: 'accept',
                    accept
               });
          }
          else {
               confirmDialog({
                    group: 'alert',
                    message: 'La session ha caducado, debe iniciar sesión nuevamente.',
                    header: 'iniciar sesión',
                    icon: 'pi pi-exclamation-triangle',
                    defaultFocus: 'accept',
                    //reject: closeModal
               });
          }
     };

     const accept = () => {
          setShowAlertModal(false);
     }

     const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          e.preventDefault();
          const value = e.target.value;
          let _filters = { ...filters };
          // @ts-ignore
          _filters['global'].value = value;
          setFilters(_filters);
          setGlobalFilterValue(value);
     };

     const [filters, setFilters] = useState<DataTableFilterMeta>({
          global: { value: null, matchMode: FilterMatchMode.CONTAINS },
          name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
          //'email': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
          representative: { value: null, matchMode: FilterMatchMode.IN },
          status: { value: null, matchMode: FilterMatchMode.EQUALS },
          verified: { value: null, matchMode: FilterMatchMode.EQUALS }
     });

     const openOverlay = () => {
          setOverlayVisible(true);
          initPageValue();
     }

     const initPageValue = () => {
          if (inputTextRef.current) {
               inputTextRef.current.value = "";
               setFormData({} as Page);
               inputTextRef.current.focus();
          }
     }

     const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
          setFormData({ ...formData, [event.target.id]: event.target.value });
     };

     const renderHeader = () => {
          return (
               <div className="flex justify-content-between pt2">
                    <div>
                         <IconField iconPosition="left">
                              <InputIcon className="pi pi-search" />
                              <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar" className="p-inputtext-sm" />
                         </IconField>
                    </div>
                    <div><Button icon={"pi pi-plus"} label="Nueva página" className="" onClick={openOverlay}></Button></div>
               </div>
          );
     };

     const optionsBodyTemplate = (page: Page) => {
          return (
               <div className="flex justify-content-end gap-2">
                    <i className="pi pi-trash" style={{ fontSize: '1.2rem', cursor: 'pointer' }} onClick={() => {
                         setShowDeleteRoleModal(true);
                         setSelectedPage(page);
                    }}></i>
               </div>
          );
     }

     const customHeader = () => {
          return (
               <div className="flex justify-content-center w-full">
                    <span className="font-bold">ADD NEW PAGE</span>
               </div>
          )
     }

     const AddNewPage = async () => {
          if (validateRole()) {

               const controller = new PageController(userLoggedData!);
               const result = await controller.AddPage({ _id: "", pageName: formData.pageName }) as unknown as ApiResultResponse;
               if (result.hasError) {
                    alertModal(new Error(result.message));
                    return;
               }
               toast.current?.show({ severity: 'success', summary: 'Saved', detail: result.message, life: 3000 });
               setPageList([...pageList, result.data as unknown as Page]);
               setOverlayVisible(false);
          }
     }

     const validateRole = (): boolean => {
          if (!formData.pageName)
               setErrorMessage('Page name is required.');
          else if (pageList.some(page => page.pageName === formData.pageName))
               setErrorMessage('Page name already exists.');
          else
               return true;

          inputTextRef.current?.select();
          inputTextRef.current?.focus();
          setShowRoleNameMessage(true);
          setTimeout(() => setShowRoleNameMessage(false), 3000);
          return false;
     }

     const acceptDeleteRole = async () => {

          try {

               const controller = new PageController(userLoggedData!);
               const result = await controller.DeletePage(selectedPage) as unknown as ApiResultResponse
               if (result.hasError) {
                    const err = new Error(result.message);
                    alertModal(err);
                    return;
               }
               toast.current?.show({ severity: 'success', summary: 'Confirmed', detail: result.message, life: 3000 });
               setPageList(pageList.filter(f => f.pageName !== selectedPage.pageName));
               let permissionsProfileStateListTmp = getPermissionsProfileStateList().filter(f => f.permissionsByRole.map((p) => p.pageName !== selectedPage.pageName))
               updatePermissionsProfile([...permissionsProfileStateListTmp]);
               setSelectedPage({} as Page);

          } catch (err) {
               console.log('error: ', err)
               const error = err as unknown as AxiosError
               const errorMessage = (error?.response?.data as any).error
               if (errorMessage === 'Invalid Bearer token')
                    alertModal();
          }
     }

     return (
          <>
               <DataTable
                    sortField="pageName"
                    sortOrder={1}
                    className='dt-pages'
                    value={pageList}
                    header={renderHeader}
                    filters={filters}
                    onFilter={(e) => setFilters(e.filters)}
                    emptyMessage="No pages found."
                    dataKey="_id"
                    loading={loading}
                    tableStyle={{ minWidth: '50rem' }}
               >
                    <Column field="pageName" header="Page" sortable />
                    <Column headerStyle={{ width: '5rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'overlayVisible' }} body={optionsBodyTemplate} />
               </DataTable>
               <Sidebar className="overlay-add-page" header={customHeader} visible={overlayVisible} position="right" onHide={() => setOverlayVisible(false)}>
                    <div className="gap-2 p-3 flex-auto flex flex-column justify-content-start font-medium">
                         <div><label>Page name:</label></div>
                         <div className="pt-2">
                              <InputText className='p-inputtext-sm w-full' id="pageName" ref={inputTextRef} name="pageName" value={formData.pageName} onChange={handleChange} required />
                              <div className={`${showRoleNameMessage ? '' : 'd-none'} pt-2 w-full`} >
                                   <Message severity="error" text={errorMessage} style={{ padding: '.5rem 1rem' }} className="w-full" />
                              </div>
                         </div>
                    </div>
                    <div className="absolute bottom-0 p-2 w-full gap-2 justify-content-endabsolute bottom-0  w-full gap-2 flex justify-content-end pr-6 pb-3">
                         <div>
                              <Button id="btnCancel" label="Cancel" outlined severity="secondary" className="w-7rem" onClick={() => {
                                   initPageValue();
                                   setOverlayVisible(false);
                              }} />
                         </div>
                         <div>
                              <Button id="btnAddPage" label="Aceptar" className="w-7rem" onClick={() => AddNewPage()} />
                         </div>
                    </div>
               </Sidebar>
               <ConfirmDialog
                    group="alert"
                    visible={showAlertModal}
                    onHide={() => setShowAlertModal(false)}
                    icon="pi pi-exclamation-triangle"
                    acceptLabel="Aceptar"
                    acceptClassName="p-button p-component p-button-raised p-button-danger"
                    rejectClassName="d-none"
               />
               <ConfirmDialog
                    id="ConfirmDialogDelete"
                    group="declarative"
                    visible={showDeleteRoleModal}
                    onHide={() => setShowDeleteRoleModal(false)}
                    message={`Are you sure you want to proceed to delete the "${selectedPage.pageName}" page?`}
                    header="Confirmation"
                    icon="pi pi-exclamation-triangle"
                    acceptLabel="Eliminar"
                    rejectLabel="Cancelar"
                    acceptClassName="p-button p-component p-button-raised p-button-danger"
                    rejectClassName="p-button p-component p-button-outlined p-button-danger"
                    accept={acceptDeleteRole}
               />
               <Toast ref={toast} />
          </>
     )
}

export default PagesDataTable;