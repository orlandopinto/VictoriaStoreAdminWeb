import { FilterMatchMode } from "primereact/api";
import { BlockUI } from "primereact/blockui";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { ProgressBar } from "primereact/progressbar";
import { Sidebar } from "primereact/sidebar";
import { Toast } from "primereact/toast";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Column, confirmDialog, ConfirmDialog, DataTable, DataTableFilterMeta, IconField, InputIcon, InputText, InputTextarea, Tooltip } from "../../components/primereact";
import { ACTIONS } from "../../config/constants.d";
import { CategoryController, SubCategoryController } from "../../controllers";
import { useAuth } from "../../hooks";
import { Category, PermissionsByRole, SubCategory } from "../../types";
import { ApiResultResponse } from '../../types/environment-response.type';
import { Helper } from "../../utils/Helper";

const SubCategoriesDataTable = () => {

     //..:: [ TYPES AND VARIABLES ] ::..
     type CategoryItems = {
          _id: string,
          categoryName: string
     }

     //NEW CATEGORY
     const inputTextCategoryNameRef = useRef<HTMLInputElement | null>(null);
     const inputTextSlugRef = useRef<HTMLInputElement | null>(null);
     const inputTextCategoryDescriptionRef = useRef<HTMLTextAreaElement | null>(null);
     const dropDownEditCategoryRef = useRef<Dropdown | null>(null);

     //EDIT CATEGORY
     const inputTextEditCategoryNameRef = useRef<HTMLInputElement | null>(null);
     const inputTextEditSlugRef = useRef<HTMLInputElement | null>(null);
     const inputTextEditCategoryDescriptionRef = useRef<HTMLInputElement | null>(null);
     const dropDownCategoryRef = useRef<Dropdown | null>(null);

     //..:: [ HOOKS ] ::..
     const navigate = useNavigate();
     const toast = useRef<Toast>(null);
     const { userLoggedData, hasAction, getPermissionList, isAllowed } = useAuth();

     //..:: [ STATES ] ::..
     const [subCategoryList, setSubCategoryList] = useState<SubCategory[]>([])
     const [permissionsByRole, setPermissionsByRole] = useState([] as PermissionsByRole[])
     const [loading, setLoading] = useState<boolean>(true);
     const [overlayVisible, setOverlayVisible] = useState<boolean>(false);
     const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
     const [showOverlayAlertModal, setShowOverlayAlertModal] = useState(false);
     const [subCategorySelectedToDelete, setSubCategorySelectedToDelete] = useState<SubCategory>({} as SubCategory)
     const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
     const [filters, setFilters] = useState<DataTableFilterMeta>({
          global: { value: null, matchMode: FilterMatchMode.CONTAINS },
          name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
          'CategoryId': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
          representative: { value: null, matchMode: FilterMatchMode.IN },
          status: { value: null, matchMode: FilterMatchMode.EQUALS },
          verified: { value: null, matchMode: FilterMatchMode.EQUALS }
     });
     const [isEdit, setIsEdit] = useState(false);
     const [subCategoryDataToEdit, setSubCategoryDataToEdit] = useState<SubCategory>({} as SubCategory);
     const [editSubCategoryName, setEditSubCategoryName] = useState('');
     const [editSubCategoryDescription, setEditSubCategoryDescription] = useState('');
     const [editSlug, setEditSlug] = useState('');
     const [isLoading, setIsLoading] = useState(false);
     const [categoryListItems, setCategoryListItems] = useState<CategoryItems[]>([]);
     const [selectedEditCategory, setSelectedEditCategory] = useState<Category | null>(null);
     const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

     useEffect(() => {
          getData()
     }, [])

     //..:: [ FUNCTIONS ] ::..

     const getData = async () => {
          if (!isAllowed(window.location.pathname.replace("/", ""))) {
               navigate('/errors/403')
          }

          setLoading(true)
          await loadCategoriesData();
          await loadSubCategoriesData();

          const permissionsByRole = getPermissionList(window.location.pathname.replace("/", ""));
          setPermissionsByRole(permissionsByRole as PermissionsByRole[]);

          setLoading(false);
     }

     const loadCategoriesData = async () => {
          try {
               const controller = new CategoryController(userLoggedData!)
               const result = await controller.GetCategories() as unknown as ApiResultResponse
               if (!result.hasError) {
                    const resultCategoryList = result.data as unknown as Category[]
                    const categoryListItemsTmp: CategoryItems[] = [];
                    for (const category of resultCategoryList) {
                         categoryListItemsTmp.push({ _id: category._id!, categoryName: category.categoryName! });
                    }
                    setCategoryListItems(categoryListItemsTmp)
               }
               else {
                    const err = new Error(result.message);
                    alertModal(err);
               }
          } catch (err) {
               console.log('error: ', err)
               alertModal(err);
          }
     }

     const loadSubCategoriesData = async () => {
          try {
               const controller = new SubCategoryController(userLoggedData!)
               const result = await controller.GetSubCategories() as unknown as ApiResultResponse
               if (!result.hasError) {
                    setSubCategoryList(result.data as unknown as SubCategory[]);
               }
               else {
                    const err = new Error(result.message);
                    alertModal(err);
               }
          } catch (err) {
               console.log('error: ', err)
               alertModal(err);
          }
     }

     const alertModal = (err?: any) => {
          if (err) {
               confirmDialog({
                    group: 'overlayAlert',
                    message: err.errorMessage ? err.errorMessage : err.message,
                    header: 'Error',
                    icon: 'pi pi-exclamation-triangle',
                    defaultFocus: 'accept',
                    accept: () => setShowOverlayAlertModal(false)
               });
          }
          else {
               confirmDialog({
                    group: 'overlayAlert',
                    message: 'La session ha caducado, debe iniciar sesión nuevamente.',
                    header: 'iniciar sesión',
                    icon: 'pi pi-exclamation-triangle',
                    defaultFocus: 'accept',
                    //reject: closeModal
               });
          }
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

     const initRegisterSubCategoryValues = () => {
          [
               inputTextCategoryNameRef,
               inputTextSlugRef,
               inputTextCategoryDescriptionRef,
               dropDownCategoryRef
          ].forEach(ref => {
               if (ref.current) (ref.current as unknown as HTMLInputElement).value = "";
          });

          setEditSubCategoryName('');
          setEditSubCategoryDescription('');
          setEditSlug('');
          setSelectedEditCategory(null);
          setSelectedCategory(null);
     }

     const openOverlay = (isEdit: boolean = false) => {
          setIsEdit(isEdit);
          setOverlayVisible(true);
          initRegisterSubCategoryValues();
     }

     const renderHeader = () => {
          return (
               <div className="flex justify-content-between pt2">
                    <div>
                         <IconField iconPosition="left">
                              <InputIcon className="pi pi-search" />
                              <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar" className="p-inputtext-sm" style={{ width: '100%' }} />
                         </IconField>
                    </div>
                    {permissionsByRole.length > 0 && hasAction(ACTIONS.CREATE) && <div><Button icon={"pi pi-plus"} label="Nueva sub categoría" className="" onClick={() => openOverlay()}></Button></div>}
               </div>
          );
     };

     const optionsBodyTemplate = (subCategory: SubCategory) => {
          return (
               <div className="flex justify-content-end gap-2">
                    {permissionsByRole.length > 0 && hasAction(ACTIONS.VIEW) && <Button icon="pi pi-eye" tooltip="View" tooltipOptions={{ position: 'top' }} rounded text />}
                    {permissionsByRole.length > 0 && hasAction(ACTIONS.EDIT) && <Button icon="pi pi-pencil" tooltip="Edit" rounded text tooltipOptions={{ position: 'top' }} onClick={async () => {
                         openOverlay(true);
                         setSubCategoryDataToEdit(subCategory);
                         setSelectedEditCategory(categoryListItems.find(f => f._id === subCategory.CategoryId) as unknown as Category);
                    }} />}
                    {permissionsByRole.length > 0 && hasAction(ACTIONS.DELETE) && <Button icon="pi pi-trash" tooltip="Delete" rounded text tooltipOptions={{ position: 'top' }}
                         onClick={() => {
                              setSubCategorySelectedToDelete(subCategory)
                              setShowDeleteCategoryModal(true)
                         }} />
                    }
               </div>
          );
     }

     const customHeader = () => {
          return (
               <div className="pl-3 w-full">
                    <span className="font-bold">{isEdit ? "EDIT SUB CATEGORY" : "NEW SUB CATEGORY"}</span>
               </div>
          )
     }

     const acceptDeleteCategory = async () => {

          try {

               const controller = new SubCategoryController(userLoggedData!);
               const result = await controller.Delete(subCategorySelectedToDelete) as unknown as ApiResultResponse
               if (result.hasError) {
                    const err = new Error(result.message);
                    alertModal(err);
                    return;
               }
               toast.current?.show({ severity: 'success', summary: 'Deleted', detail: result.message, life: 3000 });
               setSubCategoryList(subCategoryList.filter(f => f._id !== subCategorySelectedToDelete._id!));
               setOverlayVisible(false);

          } catch (err) {
               console.log('error: ', err)
               alertModal(err);
          }
     }

     const allFieldsValid = (formElements: HTMLFormControlsCollection): boolean => {
          let isValid = true;
          for (const element of formElements) {
               const inputElement = element as HTMLInputElement;
               if (inputElement.type !== 'submit' && inputElement.type !== 'button') {
                    if (inputElement.type === 'select-one') {
                         const selectControl = inputElement as unknown as HTMLSelectElement;
                         const fileUploadElement = document.getElementById('dropdown-category') as HTMLElement;
                         if (selectControl.options.length > 0 && selectControl.options[0].value === '') {
                              fileUploadElement.classList.add('p-invalid');
                              isValid = false;
                         }
                         else
                              fileUploadElement.classList.remove('p-invalid');
                    }

                    if (inputElement.value.trim() === '') {
                         inputElement.classList.add('p-invalid');
                         isValid = false;
                    } else {
                         inputElement.classList.remove('p-invalid');
                    }
               }
          }
          return isValid;
     }

     const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const form = event.currentTarget;
          const formElements = form.elements as typeof form.elements & {
               subCategoryName: { value: string },
               slug: { value: string },
               subCategoryDescription: { value: string },
          };

          if (!allFieldsValid(formElements)) return;

          createNewSubCategory();
     }

     const handleEditSubmit = (event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          updateSubCategory();
     }

     const createNewSubCategory = async () => {

          try {
               setIsLoading(true);
               const controller = new SubCategoryController(userLoggedData!);
               const subCategory: SubCategory = {
                    _id: "",
                    subCategoryName: inputTextCategoryNameRef.current?.value!,
                    slug: inputTextSlugRef.current?.value!,
                    subCategoryDescription: inputTextCategoryDescriptionRef.current?.value!,
                    CategoryId: dropDownCategoryRef.current?.props.value._id!
               }
               const result = await controller.Create(subCategory) as unknown as ApiResultResponse
               if (result.hasError) {
                    alertModal(new Error(result.message));
                    return;
               }
               toast.current?.show({ severity: 'success', summary: 'Saved', detail: result.message, life: 3000 });
               setSubCategoryList([...subCategoryList, result.data as unknown as SubCategory])
               setOverlayVisible(false);

          } catch (err) {
               console.log('error: ', err)
               alertModal(err);
          }
          finally {
               setIsLoading(false);
          }

     }

     const updateSubCategory = async () => {

          try {
               setIsLoading(true);

               const controller = new SubCategoryController(userLoggedData!);
               const subCategory: SubCategory = {
                    _id: subCategoryDataToEdit._id!,
                    subCategoryName: inputTextEditCategoryNameRef.current?.value!,
                    slug: inputTextEditSlugRef.current?.value!,
                    subCategoryDescription: inputTextEditCategoryDescriptionRef.current?.value!,
                    CategoryId: dropDownEditCategoryRef.current?.props.value._id!
               }
               const result = await controller.Update(subCategory) as unknown as ApiResultResponse
               if (result.hasError) {
                    alertModal(new Error(result.message));
                    return;
               }

               toast.current?.show({ severity: 'success', summary: 'updated', detail: result.message, life: 3000 });

               for (let cat of subCategoryList) {
                    if (cat._id === subCategory._id) {
                         const subCategoryUpdated = result.data as unknown as SubCategory;
                         cat.subCategoryName = subCategoryUpdated.subCategoryName;
                         cat.subCategoryDescription = subCategoryUpdated.subCategoryDescription;
                         cat.slug = subCategoryUpdated.slug;
                         cat.CategoryId = subCategoryUpdated.CategoryId;
                         cat.updatedAt = subCategoryUpdated.updatedAt!;
                    }
               }
               setSubCategoryList(subCategoryList)
               setOverlayVisible(false);

          } catch (err) {
               console.log('error: ', err)
               alertModal(err);
          } finally {
               setIsLoading(false);
          }

     }

     const createdAtBodyTemplate = (subCategory: SubCategory) => {
          return <span>{Helper.ConvertTimeZoneUTCToLocal(subCategory.createdAt!)}</span>
     }

     const categoryBodyTemplate = (subCategory: SubCategory) => {
          return <span>{categoryListItems.find(f => f._id === subCategory.CategoryId)?.categoryName}</span>
     }

     return (
          <>
               <DataTable
                    className='dt-categories'
                    value={subCategoryList}
                    header={renderHeader}
                    filters={filters}
                    onFilter={(e) => setFilters(e.filters)}
                    emptyMessage="No categories found."
                    sortField="email"
                    sortOrder={1}
                    paginator
                    rowsPerPageOptions={[10, 25, 50]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                    rows={10}
                    dataKey="_id"
                    loading={loading}
                    tableStyle={{ minWidth: '50rem' }}
               >
                    <Column field="_id" hidden sortable />
                    <Column field="subCategoryName" header="Name" sortable />
                    <Column field="slug" header="slug" sortable />
                    <Column field="subCategoryDescription" header="Description" sortable />
                    <Column field="CategoryId" header="category" sortable body={categoryBodyTemplate} />
                    <Column field="createdAt" header="Created at" sortable body={createdAtBodyTemplate} />
                    <Column headerStyle={{ width: '5rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={optionsBodyTemplate} />
               </DataTable>

               <Sidebar className="overlay-sub-categories w-full md:w-20rem lg:w-30rem" header={customHeader} visible={overlayVisible} position="right" onHide={() => setOverlayVisible(false)}>
                    {
                         isEdit
                              ?// EDIT CATEGORY
                              <form onSubmit={handleEditSubmit}>
                                   <div className="flex flex-column gap-2 w-full pt-4">
                                        <label htmlFor="editSubCategoryName">Name:</label>
                                        <InputText
                                             id="editSubCategoryName"
                                             ref={inputTextEditCategoryNameRef}
                                             value={editSubCategoryName || subCategoryDataToEdit.subCategoryName}
                                             onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditSubCategoryName(e.currentTarget.value)}
                                             className='p-inputtext-sm w-full'
                                             aria-describedby="edit-subCategory-name"
                                        />
                                   </div>
                                   <div className="flex flex-column gap-2 w-full pt-4">
                                        <label htmlFor="editSlug">Slug:</label>
                                        <InputText
                                             id="editSlug"
                                             ref={inputTextEditSlugRef}
                                             value={editSlug || subCategoryDataToEdit.slug}
                                             onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditSlug(e.currentTarget.value)}
                                             className='p-inputtext-sm w-full'
                                        />
                                   </div>
                                   <div className="flex flex-column gap-2 w-full pt-4">
                                        <label htmlFor="editSubCategoryDescription">Description:</label>
                                        <InputText
                                             id="editSubCategoryDescription"
                                             ref={inputTextEditCategoryDescriptionRef}
                                             value={editSubCategoryDescription || subCategoryDataToEdit.subCategoryDescription}
                                             onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditSubCategoryDescription(e.currentTarget.value)}
                                             className='p-inputtext-sm w-full'
                                        />
                                   </div>
                                   <div className="flex flex-column gap-2 w-full pt-4">
                                        <label htmlFor="subCategoryDescription">Description:</label>
                                        <Dropdown value={selectedEditCategory} onChange={(e: DropdownChangeEvent) => setSelectedEditCategory(e.value)} options={categoryListItems} optionLabel="categoryName"
                                             id="dropdown-edit-category" ref={dropDownEditCategoryRef} placeholder="Select a category" className="w-full" checkmark={true} highlightOnSelect={false} />
                                   </div>
                                   <div className="w-full p-2">
                                        {isLoading && <ProgressBar mode="indeterminate" style={{ height: '1px' }}></ProgressBar>}
                                   </div>
                                   <div className="absolute bottom-0 p-2 w-full gap-2 justify-content-endabsolute bottom-0  w-full gap-2 flex justify-content-end pr-6 pb-3">
                                        <div>
                                             <Button id="btnCancel" type="button" label="Cancel" outlined severity="secondary" className="w-7rem" onClick={() => {
                                                  setOverlayVisible(false);
                                             }} />
                                        </div>
                                        <div>
                                             <Button id="btnUpdateCategory" type="submit" label="Actualizar" className="w-7rem" />
                                        </div>
                                   </div>
                              </form>
                              :// NEW CATEGORY
                              <form onSubmit={handleSubmit}>
                                   <div className="flex flex-column gap-2 w-full pt-4">
                                        <label htmlFor="subCategoryName">Name:</label>
                                        <InputText id="subCategoryName" className='p-inputtext-sm w-full' aria-describedby="first-name" ref={inputTextCategoryNameRef} />
                                   </div>
                                   <div className="flex flex-column gap-2 w-full pt-4">
                                        <label htmlFor="slug">Slug:</label>
                                        <InputText id="slug" className='p-inputtext-sm w-full' aria-describedby="last-name" ref={inputTextSlugRef} />
                                   </div>
                                   <div className="flex flex-column gap-2 w-full pt-4">
                                        <label htmlFor="subCategoryDescription">Description:</label>
                                        <InputTextarea id="subCategoryDescription" className='p-inputtext-sm w-full' aria-describedby="subCategoryDescription" rows={4} ref={inputTextCategoryDescriptionRef} />
                                   </div>
                                   <div className="flex flex-column gap-2 w-full pt-4">
                                        <label htmlFor="subCategoryDescription">Description:</label>
                                        <Dropdown value={selectedCategory} onChange={(e: DropdownChangeEvent) => setSelectedCategory(e.value)} options={categoryListItems} optionLabel="categoryName"
                                             id="dropdown-category" ref={dropDownCategoryRef} placeholder="Select a category" className="w-full" checkmark={true} highlightOnSelect={false} />
                                   </div>
                                   <div className="w-full p-2">
                                        {isLoading && <ProgressBar mode="indeterminate" style={{ height: '1px' }}></ProgressBar>}
                                   </div>
                                   <div className="absolute bottom-0 p-2 w-full gap-2 justify-content-endabsolute bottom-0  w-full gap-2 flex justify-content-end pr-6 pb-3">
                                        <div>
                                             <Button id="btnCancel" type="button" label="Cancel" outlined severity="secondary" className="w-7rem" onClick={() => {
                                                  initRegisterSubCategoryValues();
                                                  setOverlayVisible(false);
                                             }} />
                                        </div>
                                        <div>
                                             <Button id="btnRegisterUser" type="submit" label="Crear" className="w-7rem" />
                                        </div>
                                   </div>
                              </form>
                    }
               </Sidebar>
               <ConfirmDialog
                    group="overlayAlert"
                    style={{ width: '25%' }}
                    visible={showOverlayAlertModal}
                    onHide={() => setShowOverlayAlertModal(false)}
                    icon="pi pi-exclamation-triangle"
                    acceptLabel="Aceptar"
                    acceptClassName="p-button p-component p-button-raised p-button-danger"
                    rejectClassName="d-none"
               />
               <ConfirmDialog
                    id="ConfirmDialogDelete"
                    group="ConfirmDialogDelete"
                    visible={showDeleteCategoryModal}
                    onHide={() => setShowDeleteCategoryModal(false)}
                    message={`Are you sure you want to proceed to delete the "${subCategorySelectedToDelete.subCategoryName}" subCategory?`}
                    header="Confirmation"
                    icon="pi pi-exclamation-triangle"
                    acceptLabel="Eliminar"
                    rejectLabel="Cancelar"
                    acceptClassName="p-button p-component p-button-raised p-button-danger"
                    rejectClassName="p-button p-component p-button-outlined p-button-danger"
                    accept={acceptDeleteCategory}
               />
               <Toast ref={toast} />
               <Tooltip target=".custom-target-icon" />
               <BlockUI blocked={isLoading} fullScreen />
          </>
     )
}

export default SubCategoriesDataTable;