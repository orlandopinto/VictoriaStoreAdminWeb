import { Button } from "primereact/button"
import { Card } from "primereact/card"
import { DataView } from "primereact/dataview";
import { Dropdown } from "primereact/dropdown";
import { useEffect, useState } from "react";

const Attributes = () => {
     const [attributeValues, setAttributeValues] = useState([] as AttributeValue[])

     interface AttributeValue {
          name: string,
          value: string
     }

     useEffect(() => {
          setAttributeValues([
               { name: 'color', value: 'blanco' },
               { name: 'color', value: 'rojo' },
               { name: 'color', value: 'amarillo' },
               { name: 'color', value: 'verde' },
          ]);
     }, []);

     const attrItemsTemplate = (item: AttributeValue, index: number) => {
          return (
               <div key={index} className="flex w-full justify-content-between py-1 border-bottom-1 align-items-center">
                    <div>
                         <span >
                              {item.name}
                         </span>
                    </div>
                    <div>
                         <span>{item.value}</span>
                    </div>
                    <div>
                         <Button icon="pi pi-times" rounded text severity="danger" aria-label="Cancel" />
                         {/* <Button type="button" icon="pi pi-times" className="p-button-outlined p-button-rounded p-button-danger ml-auto" onClick={() => onTemplateRemove(file, props.onRemove)} /> */}
                    </div>
               </div>
          )
     };


     const listTemplate = (items: AttributeValue[]) => {
          if (!items || items.length === 0) return null;

          let list = items.map((product, index) => {
               return attrItemsTemplate(product, index);
          });

          return <div className="grid grid-nogutter">{list}</div>;
     };

     return (
          <Card>
               <div className='w-full pt-2 pb-3 flex justify-content-between align-items-center'>
                    <span className='text-2xl'>Attributes</span>
               </div>
               <div className="w-full">
                    <div className="grid">
                         <div className="field col">
                              <label className="font-bold" htmlFor="editFirstName">Attribute:</label>
                              {/* <select id="state" className="w-full text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round outline-none focus:border-primary" style={{ appearance: "auto" }}>
                                   <option>Color</option>
                                   <option>Talla</option>
                                   <option>Pack</option>
                                   <option>Unidad</option>
                              </select> */}
                              <Dropdown
                                   //value={selectedTax}
                                   //ref={productInformationFormData.dropDownDiscountRef}
                                   // onChange={(e: DropdownChangeEvent) => {
                                   //      setSelectedTax(e.value);
                                   //      // setProductInformationFormData((prevProps) => ({
                                   //      //      ...prevProps,
                                   //      //      ["discountId"]: e.value._id
                                   //      // }));
                                   // }}
                                   options={['Color', 'Talla', 'Pack']}
                                   optionLabel="taxValue.$numberDecimal"
                                   placeholder="Select"
                                   className="w-full"
                                   checkmark={true}
                                   highlightOnSelect={false}
                              />

                         </div>
                         <div className="field col">
                              <label className="font-bold" htmlFor="editFirstName">Valor:</label>
                              <Dropdown
                                   //value={selectedTax}
                                   //ref={productInformationFormData.dropDownDiscountRef}
                                   // onChange={(e: DropdownChangeEvent) => {
                                   //      setSelectedTax(e.value);
                                   //      // setProductInformationFormData((prevProps) => ({
                                   //      //      ...prevProps,
                                   //      //      ["discountId"]: e.value._id
                                   //      // }));
                                   // }}
                                   options={['rojo', 'azul', 'verde']}
                                   optionLabel="taxValue.$numberDecimal"
                                   placeholder="Select"
                                   className="w-full"
                                   checkmark={true}
                                   highlightOnSelect={false}
                              />
                         </div>
                         <div className="field col-auto pt-5">
                              <Button label="+" />
                         </div>
                         <div className="w-full p-2">
                              <DataView value={attributeValues} listTemplate={listTemplate} />
                         </div>
                    </div>
               </div>
          </Card>
     )
}
export default Attributes