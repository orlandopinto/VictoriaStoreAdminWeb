import { FilterMatchMode } from "primereact/api";
import { BlockUI } from "primereact/blockui";
import { FileUpload, FileUploadFile, FileUploadSelectEvent } from 'primereact/fileupload';
import { ProgressBar } from "primereact/progressbar";
import { Sidebar } from "primereact/sidebar";
import { Toast } from "primereact/toast";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Column, confirmDialog, ConfirmDialog, DataTable, DataTableFilterMeta, IconField, InputIcon, InputText, InputTextarea, Tag, Tooltip } from "../../components/primereact";
import { ACTIONS, CATEGORY_FOLDER_TO_UPLOAD } from "../../config/constants.d";
import { CategoryController } from "../../controllers";
import { useAuth } from "../../hooks";
import { Category, PermissionsByRole } from "../../types";
import { CloudinaryResult } from "../../types/cloudinary-result.type";
import { ApiResultResponse } from '../../types/environment-response.type';
import { Validators } from "../../utils";
import { Helper } from "../../utils/Helper";

const CategoriesDataTable = () => {

     //..:: [ TYPES AND VARIABLES ] ::..
     type FilterCategoryList = {
          _id: string,
          categoryName: string
     }
     const fileUploadRef = useRef<FileUpload>(null);
     const editFileUploadRef = useRef<FileUpload>(null);

     //NEW CATEGORY
     const inputTextCategoryNameRef = useRef<HTMLInputElement | null>(null);
     const inputTextSlugRef = useRef<HTMLInputElement | null>(null);
     const inputTextCategoryDescriptionRef = useRef<HTMLTextAreaElement | null>(null);

     //EDIT CATEGORY
     const inputTextEditCategoryNameRef = useRef<HTMLInputElement | null>(null);
     const inputTextEditSlugRef = useRef<HTMLInputElement | null>(null);
     const inputTextEditCategoryDescriptionRef = useRef<HTMLInputElement | null>(null);

     //..:: [ HOOKS ] ::..
     const navigate = useNavigate();
     const toast = useRef<Toast>(null);
     const { userLoggedData, hasAction, getPermissionList, isAllowed } = useAuth();

     //..:: [ STATES ] ::..
     const [categoryList, setCategoryList] = useState<Category[]>([])
     const [permissionsByRole, setPermissionsByRole] = useState([] as PermissionsByRole[])
     const [loading, setLoading] = useState<boolean>(true);
     const [overlayVisible, setOverlayVisible] = useState<boolean>(false);
     const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
     const [showOverlayAlertModal, setShowOverlayAlertModal] = useState(false);
     const [categorySelectedToDelete, setCategorySelectedToDelete] = useState<Category>({} as Category)
     const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
     const [filterCategoryList, setFilterCategoryList] = useState<FilterCategoryList[]>([]);
     const [filters, setFilters] = useState<DataTableFilterMeta>({
          global: { value: null, matchMode: FilterMatchMode.CONTAINS },
          name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
          'email': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
          representative: { value: null, matchMode: FilterMatchMode.IN },
          status: { value: null, matchMode: FilterMatchMode.EQUALS },
          verified: { value: null, matchMode: FilterMatchMode.EQUALS }
     });
     const [isEdit, setIsEdit] = useState(false);
     const [categoryDataToEdit, setCategoryDataToEdit] = useState<Category>({} as Category);
     const [editCategoryName, setEditCategoryName] = useState('');
     const [editCategoryDescription, setEditCategoryDescription] = useState('');
     const [editSlug, setEditSlug] = useState('');
     const [selectedImageFile, setSelectedImageFile] = useState<FileUploadFile | null>(null);
     const [editSelectedImageFile, setEditSelectedImageFile] = useState<FileUploadFile | null>(null);
     const [isLoading, setIsLoading] = useState(false);

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

          const permissionsByRole = getPermissionList(window.location.pathname.replace("/", ""));
          setPermissionsByRole(permissionsByRole as PermissionsByRole[]);
          setLoading(false);
     }

     const loadCategoriesData = async () => {
          try {
               const controller = new CategoryController(userLoggedData!)
               const result = await controller.GetCategories() as unknown as ApiResultResponse
               if (!result.hasError) {
                    setCategoryList(result.data as unknown as Category[]);
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

     const initRegisterCategoryValues = () => {
          [
               inputTextCategoryNameRef,
               inputTextSlugRef,
               inputTextCategoryDescriptionRef
          ].forEach(ref => {
               if (ref.current) (ref.current as unknown as HTMLInputElement).value = "";
          });

          setEditCategoryName('');
          setEditCategoryDescription('');
          setEditSlug('');
     }

     const openOverlay = (isEdit: boolean = false) => {
          setIsEdit(isEdit);
          setOverlayVisible(true);
          initRegisterCategoryValues();
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
                    {permissionsByRole.length > 0 && hasAction(ACTIONS.CREATE) && <div><Button icon={"pi pi-plus"} label="Nueva categoría" className="" onClick={() => openOverlay()}></Button></div>}
               </div>
          );
     };

     const optionsBodyTemplate = (category: Category) => {
          return (
               <div className="flex justify-content-end gap-2">
                    {permissionsByRole.length > 0 && hasAction(ACTIONS.VIEW) && <Button icon="pi pi-eye" tooltip="View" tooltipOptions={{ position: 'top' }} rounded text />}
                    {permissionsByRole.length > 0 && hasAction(ACTIONS.EDIT) && <Button icon="pi pi-pencil" tooltip="Edit" rounded text tooltipOptions={{ position: 'top' }} onClick={async () => {
                         openOverlay(true);
                         setCategoryDataToEdit(category);
                         const categoryList: FilterCategoryList[] = [];
                         for (const category of categoryList) {
                              const foundCategory = filterCategoryList.find(f => f.categoryName === category.categoryName)
                              categoryList.push({ _id: foundCategory?._id!, categoryName: foundCategory?.categoryName! })
                         }
                         setFilterCategoryList(categoryList);

                         let response = await fetch(`${category.secure_url}?${category.updatedAt}`);
                         let data = await response.blob();
                         let metadata = {
                              type: `${category.secure_url.includes('.jpg') ? 'image/jpeg' : 'image/png'}`
                         };
                         let file = new File([data], `${category.secure_url.split('/')[category.secure_url.split('/').length - 1]}?${category.updatedAt}`, metadata);
                         let fileUploadFile = file as unknown as FileUploadFile;
                         fileUploadFile.objectURL = URL.createObjectURL(file);
                         editFileUploadRef.current?.setFiles([fileUploadFile]);
                    }} />}
                    {permissionsByRole.length > 0 && hasAction(ACTIONS.DELETE) && <Button icon="pi pi-trash" tooltip="Delete" rounded text tooltipOptions={{ position: 'top' }}
                         onClick={() => {
                              setCategorySelectedToDelete(category)
                              setShowDeleteCategoryModal(true)
                         }} />
                    }
               </div>
          );
     }

     const customHeader = () => {
          return (
               <div className="pl-3 w-full">
                    <span className="font-bold">{isEdit ? "EDIT CATEGORY" : "NEW CATEGORY"}</span>
               </div>
          )
     }

     const acceptDeleteCategory = async () => {

          try {

               const controller = new CategoryController(userLoggedData!);
               const result = await controller.Delete(categorySelectedToDelete) as unknown as ApiResultResponse
               if (result.hasError) {
                    const err = new Error(result.message);
                    alertModal(err);
                    return;
               }
               toast.current?.show({ severity: 'success', summary: 'Deleted', detail: result.message, life: 3000 });
               setCategoryList(categoryList.filter(f => f._id !== categorySelectedToDelete._id!));
               setOverlayVisible(false);

          } catch (err) {
               console.log('error: ', err)
               alertModal(err);
          }
     }

     const ulploadCloudinaryImage = async (): Promise<CloudinaryResult | undefined> => {
          try {
               let dataTransfer = new DataTransfer();
               dataTransfer.items.add(selectedImageFile as unknown as File);

               const controller = new CategoryController(userLoggedData!);
               let formData = new FormData();
               formData.append("file", dataTransfer.files[0]);
               formData.append("folder", CATEGORY_FOLDER_TO_UPLOAD);
               const result = await controller.UploadImage(formData) as unknown as CloudinaryResult;
               return result;
          } catch (err) {
               console.log('error: ', err)
               alertModal(err);
          }
     }

     const updateCloudinaryImage = async (public_id: string): Promise<CloudinaryResult | undefined> => {
          try {
               let dataTransfer = new DataTransfer();
               dataTransfer.items.add(editSelectedImageFile as unknown as File);

               const controller = new CategoryController(userLoggedData!);
               let formData = new FormData();
               formData.append("file", dataTransfer.files[0]);
               formData.append("public_id", public_id);
               const result = await controller.UpdateImage(formData) as unknown as CloudinaryResult;
               return result;
          } catch (err) {
               throw err;
          }
     }

     const allFieldsValid = (formElements: HTMLFormControlsCollection): boolean => {
          let isValid = true;
          for (const element of formElements) {
               const inputElement = element as HTMLInputElement;
               if (inputElement.type !== 'submit' && inputElement.type !== 'button' && inputElement.type !== 'file') {
                    if (inputElement.value.trim() === '') {
                         inputElement.classList.add('p-invalid');
                         isValid = false;
                    } else {
                         inputElement.classList.remove('p-invalid');
                    }
                    if (inputElement.id === 'email') {
                         const emailErrorMessage = document.getElementById('email-error-message') as HTMLElement;
                         if (!Validators.email.test(inputElement.value)) {
                              emailErrorMessage.classList.remove('d-none');
                              isValid = false;
                         } else {
                              emailErrorMessage.classList.add('d-none');
                         }
                    }
               }
          }
          const fileUploadElement = document.getElementById('fileImageUpload') as HTMLElement;
          if (!selectedImageFile) {
               fileUploadElement.classList.add('p-invalid');
               isValid = false;
          } else {
               fileUploadElement.classList.remove('p-invalid');
          }
          return isValid;
     }

     const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const form = event.currentTarget;
          const formElements = form.elements as typeof form.elements & {
               categoryName: { value: string },
               slug: { value: string },
               categoryDescription: { value: string },
          };

          if (!allFieldsValid(formElements)) return;

          createNewCategory();
     }

     const handleEditSubmit = (event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          updateCategory();
     }

     const createNewCategory = async () => {

          try {
               setIsLoading(true);
               const categoryImage = await ulploadCloudinaryImage();
               const controller = new CategoryController(userLoggedData!);
               const category: Category = {
                    _id: "",
                    categoryName: inputTextCategoryNameRef.current?.value!,
                    slug: inputTextSlugRef.current?.value!,
                    categoryDescription: inputTextCategoryDescriptionRef.current?.value!,
                    public_id: categoryImage?.public_id!,
                    secure_url: categoryImage?.secure_url!
               }
               const result = await controller.Create(category) as unknown as ApiResultResponse
               if (result.hasError) {
                    alertModal(new Error(result.message));
                    return;
               }
               toast.current?.show({ severity: 'success', summary: 'Saved', detail: result.message, life: 3000 });
               setCategoryList([...categoryList, result.data as unknown as Category])
               setOverlayVisible(false);

          } catch (err) {
               console.log('error: ', err)
               alertModal(err);
          }
          finally {
               setIsLoading(false);
          }

     }

     const updateCategory = async () => {

          try {
               setIsLoading(true);
               if (editSelectedImageFile)
                    await updateCloudinaryImage(categoryDataToEdit.public_id);

               const controller = new CategoryController(userLoggedData!);
               const category: Category = {
                    _id: categoryDataToEdit._id!,
                    categoryName: categoryDataToEdit.categoryName,
                    categoryDescription: categoryDataToEdit.categoryDescription,
                    slug: categoryDataToEdit.slug,
                    public_id: categoryDataToEdit.public_id,
                    secure_url: categoryDataToEdit.secure_url
               }
               const result = await controller.Update(category) as unknown as ApiResultResponse
               if (result.hasError) {
                    alertModal(new Error(result.message));
                    return;
               }

               toast.current?.show({ severity: 'success', summary: 'updated', detail: result.message, life: 3000 });

               for (let cat of categoryList) {
                    if (cat._id === category._id) {
                         cat.categoryName = category.categoryName;
                         cat.categoryDescription = category.categoryDescription;
                         cat.slug = category.slug;
                         cat.public_id = category.public_id!;
                         cat.secure_url = category.secure_url!;
                         cat.updatedAt = (result.data as unknown as Category).updatedAt!;
                    }
               }
               setCategoryList(categoryList)
               setOverlayVisible(false);

          } catch (err) {
               console.log('error: ', err)
               alertModal(err);
          } finally {
               setIsLoading(false);
          }

     }

     const categoryImageBodyTemplate = (category: Category) => {
          return (<img src={`https://res.cloudinary.com/${process.env.CLOUDINARY_NAME}/image/upload/c_fill,h_40,w_45/${category.public_id}?${Helper.RandomNumber(1, 1000)}`} alt={category.categoryName} />);
     };

     //FileUpload
     const chooseOptions = { icon: 'pi pi-fw pi-images', iconOnly: true, className: 'custom-choose-btn p-button-rounded p-button-outlined' };
     const cancelOptions = { icon: 'pi pi-fw pi-times', iconOnly: true, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined' };

     const headerFileUploadTemplate = (options: any) => {
          const { className, chooseButton, cancelButton } = options;

          return (
               <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
                    {chooseButton}
                    {cancelButton}
               </div>
          );
     };

     const itemFileUploadTemplate = (file: any, props: any) => {
          return (
               <div className="flex align-items-center flex-wrap">
                    <div className="flex align-items-center" style={{ width: '40%' }}>
                         <img alt={file.name} role="presentation" src={file.objectURL} width={100} />
                         <span className="flex flex-column text-left ml-3">
                              {file.name}
                              <small>{new Date().toLocaleDateString()}</small>
                         </span>
                    </div>
                    <Tag value={props.formatSize} severity="warning" className="px-3 py-2 ml-8" />
                    <Button type="button" icon="pi pi-times" className="p-button-outlined p-button-rounded p-button-danger ml-auto" onClick={() => onTemplateRemove(props.onRemove)} />
               </div>
          );
     };

     const emptyFileUploadTemplate = () => {
          return (
               <div className="flex align-items-center flex-column">
                    <i className="pi pi-image mt-3 p-5" style={{ fontSize: '5em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)' }}></i>
                    <span style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }} className="my-5">
                         Drag and Drop Image Here
                    </span>
               </div>
          );
     };

     const onTemplateSelect = (e: FileUploadSelectEvent, isEdit: boolean = false) => {
          let files = e.files;
          if (isEdit)
               setEditSelectedImageFile(files[0]);
          else
               setSelectedImageFile(files[0]);

          const fUpload = document.getElementById('fileImageUpload') as unknown as HTMLElement;
          if (fUpload)
               fUpload.classList.remove('p-invalid');
     };

     const onTemplateRemove = (callback: VoidFunction) => {
          callback();
          setSelectedImageFile(null);
          const fUpload = document.getElementById('fileImageUpload') as unknown as HTMLElement;
          if (fUpload)
               fUpload.classList.add('p-invalid');
     };

     const onTemplateClear = (isEdit: boolean) => {
          if (isEdit)
               setEditSelectedImageFile(null);
          else
               setSelectedImageFile(null);

          const fUpload = document.getElementById('fileImageUpload') as unknown as HTMLElement;
          if (fUpload)
               fUpload.classList.add('p-invalid');
     };

     const createdAtTemplate = (category: Category) => {
          return <span>{Helper.ConvertTimeZoneUTCToLocal(category.createdAt!)}</span>
     }

     return (
          <>
               <DataTable
                    className='dt-categories'
                    value={categoryList}
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
                    <Column body={categoryImageBodyTemplate} />
                    <Column field="categoryName" header="Name" sortable />
                    <Column field="slug" header="slug" sortable />
                    <Column field="categoryDescription" header="Description" sortable />
                    <Column field="createdAt" header="Created at" sortable body={createdAtTemplate} />
                    <Column headerStyle={{ width: '5rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={optionsBodyTemplate} />
               </DataTable>

               <Sidebar className="overlay-categories w-full md:w-20rem lg:w-30rem" header={customHeader} visible={overlayVisible} position="right" onHide={() => setOverlayVisible(false)}>
                    {
                         isEdit
                              ?// EDIT CATEGORY
                              <>
                                   <form onSubmit={handleEditSubmit}>
                                        <div className="flex flex-column gap-2 w-full pt-4">
                                             <label htmlFor="editCategoryName">Name:</label>
                                             <InputText
                                                  id="editCategoryName"
                                                  ref={inputTextEditCategoryNameRef}
                                                  value={editCategoryName || categoryDataToEdit.categoryName}
                                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditCategoryName(e.currentTarget.value)}
                                                  className='p-inputtext-sm w-full'
                                                  aria-describedby="edit-category-name"
                                             />
                                        </div>
                                        <div className="flex flex-column gap-2 w-full pt-4">
                                             <label htmlFor="editSlug">Slug:</label>
                                             <InputText
                                                  id="editSlug"
                                                  ref={inputTextEditSlugRef}
                                                  value={editSlug || categoryDataToEdit.slug}
                                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditSlug(e.currentTarget.value)}
                                                  className='p-inputtext-sm w-full'
                                             />
                                        </div>
                                        <div className="flex flex-column gap-2 w-full pt-4">
                                             <label htmlFor="editCategoryDescription">Description:</label>
                                             <InputText
                                                  id="editCategoryDescription"
                                                  ref={inputTextEditCategoryDescriptionRef}
                                                  value={editCategoryDescription || categoryDataToEdit.categoryDescription}
                                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditCategoryDescription(e.currentTarget.value)}
                                                  className='p-inputtext-sm w-full'
                                             />
                                        </div>
                                        <div className="flex flex-column gap-2 w-full pt-4">
                                             <FileUpload ref={editFileUploadRef} className="" onSelect={(e) => onTemplateSelect(e, true)} id="editFileImageUpload" name="editFileImageUpload" accept="image/*" maxFileSize={1000000}
                                                  headerTemplate={headerFileUploadTemplate} itemTemplate={itemFileUploadTemplate} emptyTemplate={emptyFileUploadTemplate}
                                                  chooseOptions={chooseOptions} cancelOptions={cancelOptions} onError={() => onTemplateClear(true)} onClear={() => onTemplateClear(true)} />
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
                              </>
                              :// NEW CATEGORY
                              <form onSubmit={handleSubmit}>
                                   <div className="flex flex-column gap-2 w-full pt-4">
                                        <label htmlFor="categoryName">Name:</label>
                                        <InputText id="categoryName" className='p-inputtext-sm w-full' aria-describedby="first-name" ref={inputTextCategoryNameRef} />
                                   </div>
                                   <div className="flex flex-column gap-2 w-full pt-4">
                                        <label htmlFor="slug">Slug:</label>
                                        <InputText id="slug" className='p-inputtext-sm w-full' aria-describedby="last-name" ref={inputTextSlugRef} />
                                   </div>
                                   <div className="flex flex-column gap-2 w-full pt-4">
                                        <label htmlFor="categoryDescription">Description:</label>
                                        <InputTextarea id="categoryDescription" className='p-inputtext-sm w-full' aria-describedby="categoryDescription" rows={4} ref={inputTextCategoryDescriptionRef} />
                                   </div>
                                   <div className="flex flex-column gap-2 w-full pt-4">
                                        <FileUpload ref={fileUploadRef} className="" onSelect={onTemplateSelect} id="fileImageUpload" name="fileImageUpload" accept="image/*" maxFileSize={1000000}
                                             headerTemplate={headerFileUploadTemplate} itemTemplate={itemFileUploadTemplate} emptyTemplate={emptyFileUploadTemplate}
                                             chooseOptions={chooseOptions} cancelOptions={cancelOptions} onError={() => onTemplateClear(false)} onClear={() => onTemplateClear(false)} />
                                   </div>
                                   <div className="w-full p-2">
                                        {isLoading && <ProgressBar mode="indeterminate" style={{ height: '1px' }}></ProgressBar>}
                                   </div>
                                   <div className="absolute bottom-0 p-2 w-full gap-2 justify-content-endabsolute bottom-0  w-full gap-2 flex justify-content-end pr-6 pb-3">
                                        <div>
                                             <Button id="btnCancel" type="button" label="Cancel" outlined severity="secondary" className="w-7rem" onClick={() => {
                                                  initRegisterCategoryValues();
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
                    message={`Are you sure you want to proceed to delete the "${categorySelectedToDelete.categoryName}" category?`}
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

export default CategoriesDataTable;