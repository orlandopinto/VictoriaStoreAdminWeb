import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { Tooltip } from "primereact/tooltip";
import { FormEvent, RefObject, useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks";
import Attributes from "./Attributes";
import CustomFileUpload from "./CustomFileUpload";
import ProductInformation from "./ProductInformation";
import ProductsDataTable from "./ProductsDataTable";
import Variants from "./Variants";
import { Dropdown } from 'primereact/dropdown';

export interface ProductInformationFormData {
     title: string;
     titleRef: RefObject<HTMLInputElement | null>;
     subTitle: string;
     subTitleRef: RefObject<HTMLInputElement | null>;
     productDescription: string;
     productDescriptionRef: RefObject<HTMLTextAreaElement | null>;
     categoryId: string;
     dropDownCategoryRef: RefObject<Dropdown | null>;
     subCategoryId: string;
     dropDownSubCategoryRef: RefObject<Dropdown | null>;
     isActive: boolean;
}

const CreateProduct = () => {

     //..:: [ VARIABLES ] ::..


     //..:: [ HOOKS ] ::..
     //WARNING: ..:: [ Las siguientes lineas son obligatiorias para ejecutar los permisos ]::..
     const { logout, isAllowed } = useAuth();
     const navigate = useNavigate();

     //..:: [ HOOKS ] ::..
     const toast = useRef<Toast>(null);
     const [dialogVisible, setDialogVisible] = useState(false);

     const titleRef = useRef<HTMLInputElement | null>(null);
     const subTitleRef = useRef<HTMLInputElement | null>(null);
     const productDescriptionRef = useRef<HTMLTextAreaElement | null>(null);
     const dropDownCategoryRef = useRef<Dropdown | null>(null);
     const dropDownSubCategoryRef = useRef<Dropdown | null>(null);

     const [productInformationFormData, setProductInformationFormData] = useState<ProductInformationFormData>({
          title: "",
          titleRef: titleRef,
          subTitle: "",
          subTitleRef: subTitleRef,
          productDescription: "",
          productDescriptionRef: productDescriptionRef,
          categoryId: "",
          dropDownCategoryRef: dropDownCategoryRef,
          subCategoryId: "",
          dropDownSubCategoryRef: dropDownSubCategoryRef,
          isActive: true
     });

     //..:: [ useEffect ] ::..
     useEffect(() => {
          const pathName = window.location.pathname;
          const path = window.location.pathname.split("/")[1];
          if (!isAllowed(path) || !pathName.includes('create')) {
               navigate('/errors/403')
          }
     }, [])

     //..:: [ FUNCTIONS ] ::..
     const dialogFooterTemplate = () => {
          return <Button label="Cerrar" icon="pi pi-check" onClick={() => setDialogVisible(false)} />;
     };

     const redirect = () => {
          logout();
          <Navigate to="/" />
     }

     const handleEditSubmit = (event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const bResult = isProductInformationDataComplete();
          console.log('hasProductInformationValidaData: ', bResult)
     };

     const isProductInformationDataComplete = (): boolean => {
          let counter = 0;
          const validations = [
               { value: productInformationFormData.title, ref: productInformationFormData.titleRef },
               { value: productInformationFormData.subTitle, ref: productInformationFormData.subTitleRef },
               { value: productInformationFormData.productDescription, ref: productInformationFormData.productDescriptionRef },
               { value: productInformationFormData.categoryId, ref: productInformationFormData.dropDownCategoryRef?.current?.getElement() },
               { value: productInformationFormData.subCategoryId, ref: productInformationFormData.dropDownSubCategoryRef?.current?.getElement() }
          ];

          validations.forEach(({ value, ref }) => {
               if (value === '') {
                    if (ref && 'current' in ref && ref.current) {
                         ref.current.classList.add('p-invalid');
                         counter++;
                    } else if (ref instanceof HTMLDivElement) {
                         ref.classList.add('p-invalid');
                    }
               }
          });
          return counter === 0;
     };


     //FILE UPLOAD
     // const [totalSize, setTotalSize] = useState(0);
     // const fileUploadRef = useRef<FileUpload>(null);

     // const onTemplateSelect = (e: FileUploadSelectEvent) => {
     //      let _totalSize = totalSize;
     //      let files = e.files;

     //      for (let i = 0; i < files.length; i++) {
     //           _totalSize += files[i].size || 0;
     //      }

     //      setTotalSize(_totalSize);
     // };

     // const onTemplateUpload = (e: FileUploadUploadEvent) => {
     //      let _totalSize = 0;

     //      e.files.forEach((file) => {
     //           _totalSize += file.size || 0;
     //      });

     //      setTotalSize(_totalSize);
     //      toast.current?.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
     // };

     // const onTemplateRemove = (file: File, callback: Function) => {
     //      setTotalSize(totalSize - file.size);
     //      callback();
     // };

     // const onTemplateClear = () => {
     //      setTotalSize(0);
     // };

     // const headerTemplate = (options: FileUploadHeaderTemplateOptions) => {
     //      const { className, chooseButton, cancelButton } = options;

     //      return (
     //           <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
     //                {chooseButton}
     //                {cancelButton}
     //           </div>
     //      );
     // };

     // const itemTemplate = (inFile: object, props: ItemTemplateOptions) => {
     //      const file = inFile as File;
     //      return (
     //           <div className="flex align-items-center flex-wrap">
     //                <div className="flex align-items-center" style={{ width: '40%' }}>
     //                     <img alt={file.name} role="presentation" src={URL.createObjectURL(file)} width={100} />
     //                     <span className="flex flex-column text-left ml-3">
     //                          {file.name}
     //                     </span>
     //                </div>
     //                <Tag value={props.formatSize} severity="warning" className="-mt-8 -ml-2 py-2" />
     //                <Button type="button" icon="pi pi-times" className="p-button-outlined p-button-rounded p-button-danger ml-auto" onClick={() => onTemplateRemove(file, props.onRemove)} />
     //           </div>
     //      );
     // };

     // const emptyTemplate = () => {
     //      return (
     //           <div className="flex align-items-center flex-column">
     //                <i className="pi pi-image mt-3 p-5" style={{ fontSize: '5em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)' }}></i>
     //                <span style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }} className="my-5">
     //                     Drag and Drop Image Here
     //                </span>
     //           </div>
     //      );
     // };


     // const chooseOptions = { icon: 'pi pi-fw pi-images', iconOnly: true, className: 'custom-choose-btn p-button-rounded p-button-outlined' };
     // const cancelOptions = { icon: 'pi pi-fw pi-times', iconOnly: true, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined' };
     //END FILE UPLOAD

     return (
          <>
               <div className='w-full pt-2 pb-3 flex justify-content-between align-items-center'>
                    <span className='text-2xl'>Create product</span>
               </div>
               <form onSubmit={handleEditSubmit}>
                    <div className="grid">
                         <div className="sm:col-12 md:col-5 lg:col-4 xl:col-3">
                              <Card>
                                   <div className='w-full pt-2 pb-3 flex justify-content-between align-items-center'>
                                        <span className='text-2xl'>Main image</span>
                                   </div>
                                   <Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />
                                   <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />
                                   {/* <FileUpload ref={fileUploadRef} name="fileUpload" url="/api/upload" accept="image/*" maxFileSize={1000000}
                                        onUpload={onTemplateUpload} onSelect={onTemplateSelect} onError={onTemplateClear} onClear={onTemplateClear}
                                        headerTemplate={headerTemplate} itemTemplate={itemTemplate} emptyTemplate={emptyTemplate}
                                        chooseOptions={chooseOptions} cancelOptions={cancelOptions} /> */}
                                   <CustomFileUpload name={"fileUploadMainImage"} accept={"image/*"} maxFileSize={1000000} multipleFiles={false} showEmptyTemplate={true} />
                              </Card>
                         </div>
                         <div className="sm:col-12 md:col-7 lg:col-8 xl:col-9">
                              <ProductInformation productInformationFormData={productInformationFormData} setProductInformationFormData={setProductInformationFormData} />
                         </div>
                    </div>
                    <div className="grid pt-2">
                         <div className="col">
                              <Card>
                                   <div className='pt-2 pb-3 flex justify-content-between align-items-center'>
                                        <span className='text-2xl'>Images</span>
                                   </div>
                                   {/* <FileUpload name="fileUploadImages" url="/api/upload" multiple accept="image/*" maxFileSize={1000000}
                                        onUpload={onTemplateUpload} onSelect={onTemplateSelect} onError={onTemplateClear} onClear={onTemplateClear}
                                        headerTemplate={headerTemplate} emptyTemplate={<p className="m-2">Drag and drop files to here to upload.</p>}
                                        chooseOptions={chooseOptions} cancelOptions={cancelOptions} /> */}
                                   <CustomFileUpload name={"fileUploadImages"} accept={"image/*"} maxFileSize={1000000} multipleFiles={true} />
                              </Card>
                         </div>
                         <div className="col">
                              <Card>
                                   <div className='pt-2 pb-3 flex justify-content-between align-items-center'>
                                        <span className='text-2xl'>Videos</span>
                                   </div>
                                   {/* <FileUpload name="fileUploadVideos" url="/api/upload" multiple accept="video/mp4,video/x-m4v,video/*" maxFileSize={10000000}
                                        onUpload={onTemplateUpload} onSelect={onTemplateSelect} onError={onTemplateClear} onClear={onTemplateClear}
                                        headerTemplate={headerTemplate} emptyTemplate={<p className="m-2">Drag and drop files to here to upload.</p>}
                                        chooseOptions={chooseOptions} cancelOptions={cancelOptions} />
                                         */}
                                   <CustomFileUpload name={"fileUploadVideos"} accept={"video/mp4,video/x-m4v,video/*"} maxFileSize={10000000} multipleFiles={false} />
                              </Card>
                         </div>
                    </div>
                    <div className="grid pt-2">
                         <div className="sm:col-12 md:col-7 lg:col-8 xl:col-9">
                              <Variants />
                         </div>
                         <div className="col">
                              <Attributes />
                         </div>
                    </div>
                    <div className="flex justify-content-end gap-2 py-3">
                         <div>
                              <Button id="btnCancel" type="button" label="Cancel" outlined severity="secondary" className="w-7rem" onClick={() => { navigate('/products') }} />
                         </div>
                         <div>
                              <Button id="btnCreateProduct" type="submit" label="Crear" className="w-7rem" />
                         </div>
                    </div>
               </form >
               <Dialog
                    header="Categories"
                    visible={dialogVisible}
                    style={{ width: '75vw' }}
                    maximizable
                    modal
                    contentStyle={{ height: '300px' }}
                    onHide={() => setDialogVisible(false)}
                    footer={dialogFooterTemplate}
               >
                    <ProductsDataTable />
               </Dialog>
               <ConfirmDialog
                    group="alert"
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
                                        label="Aceptar"
                                        onClick={(event) => {
                                             hide(event);
                                             redirect();
                                        }}
                                        className="w-8rem"
                                   ></Button>
                              </div>
                         </div>
                    )}
               />
               <Toast ref={toast}></Toast>
          </>
     )
}
export default CreateProduct