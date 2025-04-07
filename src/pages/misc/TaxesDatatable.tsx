import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { Sidebar } from "primereact/sidebar";
import { Toast } from "primereact/toast";
import { FormEvent, useEffect, useRef, useState } from "react";
import DeleteDialog from "../../components/common/DeleteDialog";
import { TaxController } from "../../controllers";
import { useAuth } from "../../hooks";
import { useAlertModal } from "../../hooks/useAlertModal";
import { onGlobalFilterChange, useFilters } from "../../hooks/useFilters";
import { ApiResultResponse, Taxes } from "../../types";

const TaxesDatatable = () => {
     const { userLoggedData } = useAuth();
     const toast = useRef<Toast>(null);
     const inputTextTaxValueRef = useRef<HTMLInputElement | null>(null);
     const [loading, setLoading] = useState<boolean>(true);
     //const [showAlertModal, setShowAlertModal] = useState(false);
     const [overlayVisible, setOverlayVisible] = useState<boolean>(false);
     const [selectedTaxes, setSelectedTaxes] = useState({} as Taxes);
     const [taxesList, setTaxesList] = useState<Taxes[]>([])
     const [errorMessage, setErrorMessage] = useState('');
     const [showTaxValueMessage, setShowTaxValueMessage] = useState(false);
     const { filters, setFilters, globalFilterValue, setGlobalFilterValue } = useFilters();
     const [showDeleteModal, setShowDeleteModal] = useState(false);

     const { showAlert } = useAlertModal();

     useEffect(() => {
          loadTaxesData()
     }, [])

     const loadTaxesData = async () => {
          try {
               const controller = new TaxController(userLoggedData!)
               const result = await controller.GetTaxes() as unknown as ApiResultResponse;
               if (result.hasError) {
                    showAlert({ err: new Error(result.message) });
                    return;
               }
               setTaxesList(result.data as unknown as Taxes[]);
          } catch (err) {
               console.log('error: ', err);
               showAlert({ err });
          } finally {
               setLoading(false)
          }
     }

     // const alertModal = (err?: any) => {
     //      if (err) {
     //           confirmDialog({
     //                group: 'alert',
     //                message: err.errorMessage ? err.errorMessage : err.message,
     //                header: 'Error',
     //                icon: 'pi pi-exclamation-triangle',
     //                defaultFocus: 'accept',
     //                accept
     //           });
     //      }
     //      else {
     //           confirmDialog({
     //                group: 'alert',
     //                message: 'La session ha caducado, debe iniciar sesión nuevamente.',
     //                header: 'iniciar sesión',
     //                icon: 'pi pi-exclamation-triangle',
     //                defaultFocus: 'accept',
     //                //reject: closeModal
     //           });
     //      }
     // };

     // const accept = () => {
     //      setShowAlertModal(false);
     // }

     const openOverlay = () => {
          setOverlayVisible(true);
          initTaxesValue();
     }

     const initTaxesValue = () => {
          if (inputTextTaxValueRef.current) {
               inputTextTaxValueRef.current.value = "";
          }
          setShowTaxValueMessage(false);
     }

     const renderHeader = () => {
          return (
               <div className="flex justify-content-between pt2">
                    <div>
                         <IconField iconPosition="left">
                              <InputIcon className="pi pi-search" />
                              <InputText value={globalFilterValue} onChange={(e) => onGlobalFilterChange(e, filters, setFilters, setGlobalFilterValue)} placeholder="Buscar" className="p-inputtext-sm" />
                         </IconField>
                    </div>
                    <div><Button type="button" icon={"pi pi-plus"} label="New tax" className="" onClick={openOverlay}></Button></div>
               </div>
          );
     };

     const optionsBodyTemplate = (tax: Taxes) => {
          return (
               <div className="flex justify-content-end gap-2">
                    <i className="pi pi-trash" style={{ fontSize: '1.2rem', cursor: 'pointer' }} onClick={() => {
                         setShowDeleteModal(true);
                         setSelectedTaxes(tax);
                    }}></i>
               </div>
          );
     }

     const customHeader = () => {
          return (
               <div className="flex justify-content-center w-full">
                    <span className="font-bold">ADD TAX</span>
               </div>
          )
     }

     const acceptDeleteTax = async () => {

          try {

               const controller = new TaxController(userLoggedData!);
               const result = await controller.DeleteTax(selectedTaxes) as unknown as ApiResultResponse
               if (result.hasError) {
                    const err = new Error(result.message);
                    showAlert({ err });
                    return;
               }
               toast.current?.show({ severity: 'success', summary: 'Confirmed', detail: result.message, life: 3000 });
               setTaxesList(taxesList.filter(f => f.taxValue !== selectedTaxes.taxValue));
               setSelectedTaxes({} as Taxes);

          } catch (err) {
               showAlert({ err });
          }
     }

     const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const { taxValue } = event.target as HTMLFormElement
          AddNewTax(taxValue.value);
     };

     const AddNewTax = async (taxValue: string) => {
          if (validateRole(taxValue)) {
               try {
                    const controller = new TaxController(userLoggedData!);
                    var decimal = parseFloat(taxValue as unknown as string);
                    const result = await controller.AddTax({ _id: "", taxValue: decimal }) as unknown as ApiResultResponse;
                    if (result.hasError) {
                         showAlert({ err: new Error(result.message) });
                         return;
                    }
                    toast.current?.show({ severity: 'success', summary: 'Saved', detail: result.message, life: 3000 });
                    setTaxesList([...taxesList, result.data as unknown as Taxes]);
                    setOverlayVisible(false);
               } catch (err) {
                    showAlert({ err });
               }

          }
     }

     const validateRole = (taxValue: string): boolean => {
          if (taxesList.some(tax => tax.taxValue.$numberDecimal === taxValue)) {
               setErrorMessage('Taxes name already exists.');
               setShowTaxValueMessage(true);
               setTimeout(() => setShowTaxValueMessage(false), 3000);
               return false;
          }
          return true;
     }

     return (
          <>
               <DataTable
                    sortField="taxValue"
                    sortOrder={1}
                    className='dt-taxes'
                    value={taxesList}
                    header={renderHeader}
                    filters={filters}
                    onFilter={(e) => setFilters(e.filters)}
                    emptyMessage="No taxes found."
                    dataKey="_id"
                    loading={loading}
                    tableStyle={{ minWidth: '50rem' }}
               >
                    <Column field="_id" hidden />
                    <Column header="Value" sortable field="taxValue.$numberDecimal" />
                    <Column headerStyle={{ width: '5rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'overlayVisible' }} body={optionsBodyTemplate} />
               </DataTable>
               <Sidebar className="overlay-add-tax" header={customHeader} visible={overlayVisible} position="right" onHide={() => setOverlayVisible(false)}>
                    <form onSubmit={handleSubmit}>
                         <div className="gap-2 p-3 flex-auto flex flex-column justify-content-start font-medium">
                              <div><label>Value:</label></div>
                              <div className="pt-2">
                                   <InputNumber className='w-full' minFractionDigits={2} name="taxValue" required />
                                   <div className={`${showTaxValueMessage ? '' : 'd-none'} pt-2 w-full`} >
                                        <Message severity="error" text={errorMessage} style={{ padding: '.5rem 1rem' }} className="w-full" />
                                   </div>
                              </div>
                         </div>
                         <div className="absolute bottom-0 pb-4 w-full gap-2 flex justify-content-end pr-6">
                              <div>
                                   <Button id="btnCancel" type="button" label="Cancel" outlined severity="secondary" className="w-7rem" onClick={() => {
                                        initTaxesValue();
                                        setOverlayVisible(false);
                                   }} />
                              </div>
                              <div>
                                   <Button id="btnAddNewTax" label="Aceptar" className="w-7rem" />
                              </div>
                         </div>
                    </form>
               </Sidebar>
               {/* `Are you sure you want to proceed to delete the "${itemToDelete}" tax?` */}
               {/* <AlertDialog showAlertModal={showAlertModal} setShowAlertModal={setShowAlertModal} /> */}
               <DeleteDialog showDeleteModal={showDeleteModal} setShowDeleteModal={setShowDeleteModal} messageToDelete="" acceptDelete={acceptDeleteTax} />
               <Toast ref={toast} />
          </>
     )
}

export default TaxesDatatable