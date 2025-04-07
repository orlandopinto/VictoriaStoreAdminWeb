import { Card } from "primereact/card"
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown"
import { InputSwitch, InputSwitchChangeEvent } from "primereact/inputswitch"
import { InputText } from "primereact/inputtext"
import { InputTextarea } from "primereact/inputtextarea"
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react"
import { CategoryController, SubCategoryController } from "../../controllers"
import { useAuth } from "../../hooks"
import { ApiResultResponse, Category, SubCategory } from "../../types"
import { ProductInformationFormData } from "./CreateProduct"

interface Props {
     productInformationFormData: ProductInformationFormData;
     setProductInformationFormData: Dispatch<SetStateAction<ProductInformationFormData>>
}

const ProductInformation = ({ productInformationFormData, setProductInformationFormData }: Props) => {

     // STATES
     const [isActive, setIsActive] = useState(true);
     const [categoryList, setCategoryList] = useState<Category[]>([])
     const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
     const [subCategoriesList, setSubCategoriesList] = useState<SubCategory[]>([])
     const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);
     const [subCategoriesByCategory, setSubCategoriesByCategory] = useState<SubCategory[]>([]);

     //HOOKS
     const { userLoggedData } = useAuth();

     useEffect(() => {
          loadCategoryList();
          loadSubCategoriesList();
     }, [])

     //FUNCTIONS
     const loadCategoryList = async () => {
          try {
               const controller = new CategoryController(userLoggedData!)
               const result = await controller.GetCategories() as unknown as ApiResultResponse
               if (!result.hasError) {
                    setCategoryList(result.data as unknown as Category[]);
               }
               else {
                    const err = new Error(result.message);
                    console.log(err);
               }
          } catch (err) {
               console.log('error: ', err)
          }
     };

     const loadSubCategoriesList = async () => {
          try {
               const controller = new SubCategoryController(userLoggedData!)
               const result = await controller.GetSubCategories() as unknown as ApiResultResponse
               if (!result.hasError) {
                    setSubCategoriesList(result.data as unknown as SubCategory[]);
               }
               else {
                    const err = new Error(result.message);
                    console.log(err);
               }
          } catch (err) {
               console.log('error: ', err)
          }
     };

     const handleInputChange = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement> | InputSwitchChangeEvent) => {
          const { name, value } = event.target;
          setProductInformationFormData((prevProps) => ({
               ...prevProps,
               [name]: value
          }));
     };

     const onSelectSubCategoriesByCategory = (Category: Category) => {
          setSubCategoriesByCategory(subCategoriesList.filter(f => f.CategoryId === Category?._id));
     };

     return (
          <Card>
               <div className='w-full pt-2 pb-3 flex justify-content-between align-items-center'>
                    <span className='text-2xl'>Product information</span>
               </div>
               <div className="grid pt-2">
                    <div className="field col-12 md:col-5">
                         <label className="font-bold" htmlFor="title">Title:</label>
                         <InputText
                              id="title"
                              name="title"
                              ref={productInformationFormData.titleRef}
                              value={productInformationFormData.title}
                              onChange={handleInputChange}
                              className='p-inputtext w-full'
                         />
                    </div>
                    <div className="field col-12 md:col-7">
                         <label className="font-bold" htmlFor="subTitle">Sub title:</label>
                         <InputText
                              id="subTitle"
                              name="subTitle"
                              ref={productInformationFormData.subTitleRef}
                              value={productInformationFormData.subTitle}
                              onChange={handleInputChange}
                              className='p-inputtext w-full'
                         />
                    </div>
               </div>
               <div className="grid pt-2">
                    <div className="field col-12">
                         <label className="font-bold" htmlFor="productDescription">Description:</label>
                         <InputTextarea
                              id="productDescription"
                              name="productDescription"
                              ref={productInformationFormData.productDescriptionRef}
                              value={productInformationFormData.productDescription}
                              onChange={handleInputChange}
                              className='w-full'
                              rows={4}
                         />
                    </div>
               </div>
               <div className="grid pt-2">
                    <div className="field col">
                         <label className="font-bold" htmlFor="categoryList">Categories:</label>
                         <Dropdown
                              value={selectedCategory}
                              ref={productInformationFormData.dropDownCategoryRef}
                              onChange={(e: DropdownChangeEvent) => {
                                   setSelectedCategory(e.value);
                                   onSelectSubCategoriesByCategory(e.value);
                                   setProductInformationFormData((prevProps) => ({
                                        ...prevProps,
                                        ["categoryId"]: e.value._id
                                   }));
                              }}
                              options={categoryList}
                              optionLabel="categoryName"
                              placeholder="Select a category"
                              className="w-full"
                              checkmark={true}
                              highlightOnSelect={false}
                         />
                    </div>
                    <div className="field col">
                         <label className="font-bold" htmlFor="subCategoriesByCategory">Sub categories:</label>
                         <Dropdown
                              value={selectedSubCategory}
                              ref={productInformationFormData.dropDownSubCategoryRef}
                              onChange={(e: DropdownChangeEvent) => {
                                   setSelectedSubCategory(e.value);
                                   setProductInformationFormData((prevProps) => ({
                                        ...prevProps,
                                        ["subCategoryId"]: e.value._id
                                   }));
                              }}
                              options={subCategoriesByCategory}
                              optionLabel="subCategoryName"
                              placeholder="Select a sub category"
                              className="w-full"
                              checkmark={true}
                              highlightOnSelect={false}
                         />
                    </div>
                    <div className="field col">
                         <label className="font-bold" htmlFor="isActive">Active:</label>
                         <div className="pt-2">
                              <InputSwitch name="isActive" checked={isActive} onChange={(e) => {
                                   setIsActive(e.value);
                                   handleInputChange(e);
                              }} />
                         </div>
                    </div>
               </div>
          </Card>
     )
}
export default ProductInformation