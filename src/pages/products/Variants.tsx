import { Card } from "primereact/card";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { DiscountController } from "../../controllers/discount.controller";
import { useAuth } from "../../hooks";
import { ApiResultResponse, Discount, Taxes, } from "../../types";
import { TaxController } from "../../controllers/tax.controller";

const Variants = () => {

     const { userLoggedData } = useAuth();
     const [discountList, setDiscountList] = useState<Discount[]>([])
     const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null);

     const [taxesList, setTaxesList] = useState<Taxes[]>([])
     const [selectedTax, setSelectedTax] = useState<Taxes | null>(null);

     const [inStock, setInStock] = useState(true);

     useEffect(() => {
          loadDiscountsData();
          loadTaxesData();
     }, [])

     //..:: [ FUNCTIONS ] ::..

     const loadDiscountsData = async () => {
          try {
               const controller = new DiscountController(userLoggedData!)
               const result = await controller.GetDiscounts() as unknown as ApiResultResponse;
               if (result.hasError) {
                    return;
               }
               setDiscountList(result.data as unknown as Discount[]);
          } catch (err) {
               console.log('error: ', err)
          }
     }

     const loadTaxesData = async () => {
          try {
               const controller = new TaxController(userLoggedData!)
               const result = await controller.GetTaxes() as unknown as ApiResultResponse;
               if (result.hasError) {
                    return;
               }
               setTaxesList(result.data as unknown as Taxes[]);
          } catch (err) {
               console.log('error: ', err)
          }
     }

     return (
          <Card>
               <div className='w-full pt-2 pb-3 flex justify-content-between align-items-center'>
                    <span className='text-2xl'>Variants</span>
               </div>
               <div className="grid pt-2">
                    <div className="field col">
                         <label className="font-bold" htmlFor="price">Price:</label>
                         <InputText
                              id="price"
                              // ref={inputTextEditFirstNameRef}
                              // value={editFirstName || userDataToEdit.firstName}
                              // onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditFirstName(e.currentTarget.value)}
                              className='p-inputtext w-full'
                              aria-describedby="edit-first-name"
                         />
                    </div>
                    <div className="field col">
                         <label className="font-bold" htmlFor="editFirstName">Discount:</label>
                         <Dropdown
                              value={selectedDiscount}
                              //ref={productInformationFormData.dropDownDiscountRef}
                              onChange={(e: DropdownChangeEvent) => {
                                   setSelectedDiscount(e.value);
                                   // setProductInformationFormData((prevProps) => ({
                                   //      ...prevProps,
                                   //      ["discountId"]: e.value._id
                                   // }));
                              }}
                              options={discountList}
                              optionLabel="discountName"
                              placeholder="Select a discount"
                              className="w-full"
                              checkmark={true}
                              highlightOnSelect={false}
                         />
                    </div>
                    <div className="field col">
                         <label className="font-bold" htmlFor="editFirstName">Tax:</label>
                         <Dropdown
                              value={selectedTax}
                              //ref={productInformationFormData.dropDownDiscountRef}
                              onChange={(e: DropdownChangeEvent) => {
                                   setSelectedTax(e.value);
                                   // setProductInformationFormData((prevProps) => ({
                                   //      ...prevProps,
                                   //      ["discountId"]: e.value._id
                                   // }));
                              }}
                              options={taxesList}
                              optionLabel="taxValue.$numberDecimal"
                              placeholder="Select a tax"
                              className="w-full"
                              checkmark={true}
                              highlightOnSelect={false}
                         />
                    </div>
               </div>
               <div className="grid pt-2">
                    <div className="field sm:col-9">
                         <label className="font-bold" htmlFor="editFirstName">Sku:</label>
                         <InputText
                              id="editFirstName"
                              // ref={inputTextEditFirstNameRef}
                              // value={editFirstName || userDataToEdit.firstName}
                              // onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditFirstName(e.currentTarget.value)}
                              className='p-inputtext w-full'
                              aria-describedby="edit-first-name"
                         />
                    </div>
                    <div className="field col">
                         <label className="font-bold" htmlFor="editFirstName">Stock:</label>
                         <InputText
                              id="editFirstName"
                              // ref={inputTextEditFirstNameRef}
                              // value={editFirstName || userDataToEdit.firstName}
                              // onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditFirstName(e.currentTarget.value)}
                              className='p-inputtext w-full'
                              aria-describedby="edit-first-name"
                         />
                    </div>
                    <div className="field col">
                         <label className="font-bold" htmlFor="editFirstName">In stock:</label>
                         <div className="pt-2">
                              <InputSwitch checked={inStock} onChange={(e) => setInStock(e.value)} />
                         </div>
                    </div>
               </div>
               <div className="grid pt-2">
                    <div className="field col">
                         <label className="font-bold" htmlFor="editFirstName">width:</label>
                         <InputText
                              id="editFirstName"
                              // ref={inputTextEditFirstNameRef}
                              // value={editFirstName || userDataToEdit.firstName}
                              // onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditFirstName(e.currentTarget.value)}
                              className='p-inputtext w-full'
                              aria-describedby="edit-first-name"
                         />
                    </div>
                    <div className="field col">
                         <label className="font-bold" htmlFor="editFirstName">height:</label>
                         <InputText
                              id="editFirstName"
                              // ref={inputTextEditFirstNameRef}
                              // value={editFirstName || userDataToEdit.firstName}
                              // onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditFirstName(e.currentTarget.value)}
                              className='p-inputtext w-full'
                              aria-describedby="edit-first-name"
                         />
                    </div>
                    <div className="field col">
                         <label className="font-bold" htmlFor="editFirstName">length:</label>
                         <InputText
                              id="editFirstName"
                              // ref={inputTextEditFirstNameRef}
                              // value={editFirstName || userDataToEdit.firstName}
                              // onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditFirstName(e.currentTarget.value)}
                              className='p-inputtext w-full'
                              aria-describedby="edit-first-name"
                         />
                    </div>
                    <div className="field col">
                         <label className="font-bold" htmlFor="editFirstName">weight:</label>
                         <InputText
                              id="editFirstName"
                              // ref={inputTextEditFirstNameRef}
                              // value={editFirstName || userDataToEdit.firstName}
                              // onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditFirstName(e.currentTarget.value)}
                              className='p-inputtext w-full'
                              aria-describedby="edit-first-name"
                         />
                    </div>
               </div>
          </Card>
     )
}
export default Variants