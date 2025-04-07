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
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import DeleteDialog from "../../components/common/DeleteDialog";
import { DiscountController } from "../../controllers";
import { useAuth } from "../../hooks";
import { useAlertModal } from "../../hooks/useAlertModal";
import { onGlobalFilterChange, useFilters } from "../../hooks/useFilters";
import { ApiResultResponse, Discount } from "../../types";
import { Helper } from "../../utils/Helper";

const DiscountsDatatable = () => {

     const { userLoggedData, logout } = useAuth();
     const { showAlert, showEndSessionAlert } = useAlertModal();

     const toast = useRef<Toast>(null);
     //const inputTextDiscountNameRef = useRef<HTMLInputElement>(null!);
     //const inputTextDiscountValueRef = useRef<HTMLInputElement>(null!);
     const [loading, setLoading] = useState<boolean>(true);
     const [overlayVisible, setOverlayVisible] = useState<boolean>(false);

     const [selectedEditDiscount, setSelectedEditDiscount] = useState({} as Discount);
     const [selectedDiscountToDelete, setSelectedDiscountToDelete] = useState({} as Discount);

     const [discountList, setDiscountList] = useState<Discount[]>([])
     const [errorMessage, setErrorMessage] = useState('');
     const [showDiscountValueMessage, setShowDiscountValueMessage] = useState(false);
     const { filters, setFilters, globalFilterValue, setGlobalFilterValue } = useFilters();
     const [showDeleteModal, setShowDeleteModal] = useState(false);
     const [messageToDelete, setMessageToDelete] = useState('');

     const [inputDiscountName, setInputDiscountName] = useState('')

     useEffect(() => {
          loadDiscountsData()
     }, [])

     const loadDiscountsData = async () => {
          try {
               const controller = new DiscountController(userLoggedData!)
               const result = await controller.GetDiscounts() as unknown as ApiResultResponse;
               if (result.hasError) {
                    showAlert({ err: new Error(result.message) });
                    return;
               }
               setDiscountList(result.data as unknown as Discount[]);
          } catch (err) {
               console.log('error: ', err);
               const error = err as Error
               if (error.message.includes('accessToken'))
                    showEndSessionAlert({ accept: logout });
               else
                    showAlert({ err });
          } finally {
               setLoading(false)
          }
     }

     const openOverlay = () => {
          setOverlayVisible(true);
          initDiscountValues();
     }

     const initDiscountValues = () => {
          setSelectedEditDiscount({} as Discount);
          setSelectedDiscountToDelete({} as Discount);
          setShowDiscountValueMessage(false);
     }

     const renderHeader = () => {
          return (
               <div className="flex justify-content-between pt2">
                    <div className="-ml-3">
                         <IconField iconPosition="left">
                              <InputIcon className="pi pi-search" />
                              <InputText value={globalFilterValue} onChange={(e) => onGlobalFilterChange(e, filters, setFilters, setGlobalFilterValue)} placeholder="Buscar" className="p-inputtext-sm" />
                         </IconField>
                    </div>
                    <div><Button type="button" icon={"pi pi-plus"} label="New discount" className="" onClick={openOverlay}></Button></div>
               </div >
          );
     };

     const optionsBodyTemplate = (discount: Discount) => {
          return (
               <div className="flex justify-content-end gap-2">
                    {/* {permissionsByRole.length > 0 && hasAction(ACTIONS.EDIT) && <Button icon="pi pi-pencil" tooltip="Edit" rounded text tooltipOptions={{ position: 'top' }} onClick={() => navigate(`/products/edit/${product._id}`, { state: { product } })} />} */}
                    <i className="pi pi-pencil" style={{ fontSize: '1.2rem', cursor: 'pointer' }} onClick={
                         () => {
                              setOverlayVisible(true);
                              setSelectedEditDiscount(discount);
                              setInputDiscountName(discount.discountName);
                              setShowDiscountValueMessage(false);
                         }
                    } ></i>

                    <i className="pi pi-trash" style={{ fontSize: '1.2rem', cursor: 'pointer' }} onClick={() => {
                         setShowDeleteModal(true);
                         setSelectedDiscountToDelete(discount);
                         setMessageToDelete(`Are you sure you want to proceed to delete the "${discount.discountName}" discount?`)
                    }}></i>
               </div>
          );
     }

     const customHeader = () => {
          return (
               <div className="w-full">
                    <span className="font-bold">{selectedEditDiscount.discountName !== undefined ? 'EDIT' : 'ADD'} DISCOUNT</span>
               </div>
          )
     }

     const acceptDeleteDiscount = async () => {
          try {
               const controller = new DiscountController(userLoggedData!);
               const result = await controller.DeleteDiscount(selectedDiscountToDelete) as unknown as ApiResultResponse
               if (result.hasError) {
                    const err = new Error(result.message);
                    showAlert({ err });
                    return;
               }
               toast.current?.show({ severity: 'success', summary: 'Confirmed', detail: result.message, life: 3000 });
               setDiscountList(discountList.filter(f => f.discountValue !== selectedDiscountToDelete.discountValue));
               setSelectedDiscountToDelete({} as Discount);

          } catch (err) {
               showAlert({ err });
          }
     }

     const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const { discountName, discountValue } = event.target as HTMLFormElement
          if (selectedEditDiscount.discountName !== undefined) {
               EditDiscount(selectedEditDiscount._id, discountName.value, discountValue.value);
          }
          else
               AddNewDiscount(discountName.value, discountValue.value);
     };

     const AddNewDiscount = async (discountName: string, discountValue: string, _id?: string) => {
          if (validateDiscount(_id!, discountName)) {
               try {
                    const controller = new DiscountController(userLoggedData!);
                    const result = await controller.AddDiscount({ _id: "", discountName: discountName, discountValue: discountValue.replace("%", "") }) as unknown as ApiResultResponse;
                    if (result.hasError) {
                         showAlert({ err: new Error(result.message) });
                         return;
                    }
                    toast.current?.show({ severity: 'success', summary: 'Saved', detail: result.message, life: 3000 });
                    setDiscountList([...discountList, result.data as unknown as Discount]);
                    setOverlayVisible(false);
               } catch (err) {
                    showAlert({ err });
               }
          }
     }

     const EditDiscount = async (_id: string, discountName: string, discountValue: string) => {
          if (validateDiscount(_id, discountName)) {
               try {
                    const controller = new DiscountController(userLoggedData!);
                    const result = await controller.UpdateDiscount({ _id: _id, discountName: discountName, discountValue: discountValue.replace("%", "") }) as unknown as ApiResultResponse;
                    if (result.hasError) {
                         showAlert({ err: new Error(result.message) });
                         return;
                    }
                    toast.current?.show({ severity: 'success', summary: 'Saved', detail: result.message, life: 3000 });
                    for (const discount of discountList) {
                         if (discount._id === _id) {
                              discount.discountName = discountName;
                              discount.discountValue = discountValue.replace("%", "");
                         }
                    }
                    setDiscountList(discountList);
                    setOverlayVisible(false);
               } catch (err) {
                    showAlert({ err });
               }
          }
     }

     const validateDiscount = (_id: string, discountName: string): boolean => {
          if (discountList.some(discount => discount._id != _id && discount.discountName === discountName)) {
               setErrorMessage('Discount name already exists.');
               setShowDiscountValueMessage(true);
               setTimeout(() => setShowDiscountValueMessage(false), 3000);
               return false;
          }
          return true;
     }

     const discountValueBodyTemplate = (discount: Discount) => {
          const discountValue = Helper.converToDecimal(discount.discountValue) === undefined ? discount.discountValue : Helper.converToDecimal(discount.discountValue);
          return <span>{discountValue}%</span>
     }

     const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
          setInputDiscountName(e.target.value);
     }

     const createdAtTemplate = (discount: Discount) => {
          return <span>{Helper.ConvertTimeZoneUTCToLocal(discount.createdAt!)}</span>
     }

     return (
          <>
               <DataTable
                    sortField="discountName"
                    sortOrder={1}
                    className='dt-discounts'
                    value={discountList}
                    header={renderHeader}
                    filters={filters}
                    onFilter={(e) => setFilters(e.filters)}
                    emptyMessage="No discounts found."
                    dataKey="_id"
                    loading={loading}
                    tableStyle={{ minWidth: '50rem' }}
               >
                    <Column field="_id" hidden />
                    <Column field="discountName" header="Name" sortable />
                    <Column field="discountValue.$numberDecimal" header="Value" body={discountValueBodyTemplate} sortable />
                    <Column field="createdAt" header="Created at" body={createdAtTemplate} sortable />
                    <Column headerStyle={{ width: '5rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'overlayVisible' }} body={optionsBodyTemplate} />
               </DataTable>
               <Sidebar className="overlay-add-discount" header={customHeader} visible={overlayVisible} position="right" onHide={() => setOverlayVisible(false)}>
                    <form onSubmit={handleSubmit}>
                         {
                              selectedEditDiscount.discountName !== undefined ?
                                   <div className="gap-2 p-3 flex-auto flex flex-column justify-content-start font-medium">
                                        <input type="hidden" name="_id" value={selectedEditDiscount._id} />
                                        <div className="px-1 pt-2"><label>Name:</label></div>
                                        <div className="pt-2">
                                             <InputText name="discountName" className='w-full' value={inputDiscountName} onChange={onInputChange} required />
                                             <div className={`${showDiscountValueMessage ? '' : 'd-none'} pt-2 w-full`} >
                                                  <Message severity="error" text={errorMessage} style={{ padding: '.5rem 1rem' }} className="w-full" />
                                             </div>
                                        </div>
                                        <div className="px-1 pt-2"><label>Value:</label></div>
                                        <div className="pt-2">
                                             <InputNumber name="discountValue" className='w-full' suffix="%" value={Helper.converToDecimal(selectedEditDiscount.discountValue) | selectedEditDiscount.discountValue as any} required />
                                        </div>
                                   </div>
                                   :
                                   <div className="gap-2 p-3 flex-auto flex flex-column justify-content-start font-medium">
                                        <input type="hidden" name="_id" />
                                        <div className="px-1 pt-2"><label>Name:</label></div>
                                        <div className="pt-2">
                                             <InputText name="discountName" className='w-full' value={selectedEditDiscount.discountName} required />
                                             <div className={`${showDiscountValueMessage ? '' : 'd-none'} pt-2 w-full`} >
                                                  <Message severity="error" text={errorMessage} style={{ padding: '.5rem 1rem' }} className="w-full" />
                                             </div>
                                        </div>
                                        <div className="px-1 pt-2"><label>Value:</label></div>
                                        <div className="pt-2">
                                             <InputNumber name="discountValue" className='w-full' suffix="%" required />
                                        </div>
                                   </div>
                         }
                         <div className="absolute bottom-0 pb-4 w-full gap-2 flex justify-content-end pr-6">
                              <div>
                                   <Button id="btnCancel" type="button" label="Cancel" outlined severity="secondary" className="w-7rem" onClick={() => {
                                        initDiscountValues();
                                        setOverlayVisible(false);
                                   }} />
                              </div>
                              {
                                   selectedEditDiscount.discountName !== undefined ?
                                        <div>
                                             <Button id="btnEditDiscount" label="Actualizar" className="w-7rem" />
                                        </div>
                                        :
                                        <div>
                                             <Button id="btnAddNewDiscount" label="Aceptar" className="w-7rem" />
                                        </div>
                              }
                         </div>
                    </form>
               </Sidebar>
               <DeleteDialog showDeleteModal={showDeleteModal} setShowDeleteModal={setShowDeleteModal} messageToDelete={messageToDelete} acceptDelete={acceptDeleteDiscount} />
               <Toast ref={toast} />
          </>
     )
}

export default DiscountsDatatable