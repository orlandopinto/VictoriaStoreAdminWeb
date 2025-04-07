import { FilterMatchMode } from "primereact/api";
import { BlockUI } from "primereact/blockui";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Tooltip } from "primereact/tooltip";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ACTIONS } from "../../config/constants.d";
import { CategoryController, ProductController } from "../../controllers";
import { useAuth } from "../../hooks";
import { ApiResultResponse, Category, PermissionsByRole, Product } from "../../types";
import { Helper } from "../../utils/Helper";

const ProductsDataTable = () => {
     //..:: [ HOOKS ] ::..
     const navigate = useNavigate();
     const toast = useRef<Toast>(null);
     const { userLoggedData, hasAction, getPermissionList } = useAuth();

     //..:: [ STATES ] ::..
     const [productList, setProductList] = useState<Product[]>([])
     const [categoryList, setCategoryList] = useState<Category[]>([])
     const [permissionsByRole, setPermissionsByRole] = useState([] as PermissionsByRole[])
     const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
     const [showOverlayAlertModal, setShowOverlayAlertModal] = useState(false);
     const [productSelectedToDelete, setProductSelectedToDelete] = useState<Product>({} as Product)
     const [showDeleteProductModal, setShowDeleteProductModal] = useState(false);
     const [filters, setFilters] = useState<DataTableFilterMeta>({
          global: { value: null, matchMode: FilterMatchMode.CONTAINS },
          name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
          'email': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
          representative: { value: null, matchMode: FilterMatchMode.IN },
          status: { value: null, matchMode: FilterMatchMode.EQUALS },
          verified: { value: null, matchMode: FilterMatchMode.EQUALS }
     });
     const [productDataToEdit, setProductDataToEdit] = useState<Product>({} as Product);
     // const [editProductName, setEditProductName] = useState('');
     // const [editProductDescription, setEditProductDescription] = useState('');
     // const [editSlug, setEditSlug] = useState('');
     // const [selectedImageFile, setSelectedImageFile] = useState<FileUploadFile | null>(null);
     // const [editSelectedImageFile, setEditSelectedImageFile] = useState<FileUploadFile | null>(null);
     const [isLoading, setIsLoading] = useState(false);

     useEffect(() => {
          getData()
     }, [])

     //..:: [ FUNCTIONS ] ::..

     const getData = async () => {
          setIsLoading(true)
          await loadProductsData();
          await loadcategoriesData();

          const permissionsByRole = getPermissionList(window.location.pathname.replace("/", ""));
          setPermissionsByRole(permissionsByRole as PermissionsByRole[]);
          setIsLoading(false);
     }

     const loadProductsData = async () => {
          try {
               const controller = new ProductController(userLoggedData!)
               const result = await controller.GetProducts() as unknown as ApiResultResponse
               if (!result.hasError) {
                    setProductList(result.data as unknown as Product[]);
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

     const loadcategoriesData = async () => {
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


     const renderHeader = () => {
          return (
               <div className="flex justify-content-between pt2">
                    <div>
                         <IconField iconPosition="left">
                              <InputIcon className="pi pi-search" />
                              <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar" className="p-inputtext-sm" style={{ width: '100%' }} />
                         </IconField>
                    </div>
                    {permissionsByRole.length > 0 && hasAction(ACTIONS.CREATE) && <div><Button icon={"pi pi-plus"} label="Nuevo producto" className="" onClick={() => navigate('/products/create')}></Button></div>}
               </div>
          );
     };

     const optionsBodyTemplate = (product: Product) => {
          setProductDataToEdit(product);
          return (
               <div className="flex justify-content-end gap-2">
                    {permissionsByRole.length > 0 && hasAction(ACTIONS.VIEW) && <Button icon="pi pi-eye" tooltip="View" tooltipOptions={{ position: 'top' }} rounded text />}
                    {permissionsByRole.length > 0 && hasAction(ACTIONS.EDIT) && <Button icon="pi pi-pencil" tooltip="Edit" rounded text tooltipOptions={{ position: 'top' }} onClick={() => navigate(`/products/edit/${product._id}`, { state: { product } })} />}
                    {permissionsByRole.length > 0 && hasAction(ACTIONS.DELETE) && <Button icon="pi pi-trash" tooltip="Delete" rounded text tooltipOptions={{ position: 'top' }}
                         onClick={() => {
                              setProductSelectedToDelete(product)
                              setShowDeleteProductModal(true)
                         }} />
                    }
               </div>
          );
     }

     const acceptDeleteProduct = async () => {

          try {

               const controller = new ProductController(userLoggedData!);
               const result = await controller.DeleteProduct(productSelectedToDelete) as unknown as ApiResultResponse
               if (result.hasError) {
                    const err = new Error(result.message);
                    alertModal(err);
                    return;
               }
               toast.current?.show({ severity: 'success', summary: 'Deleted', detail: result.message, life: 3000 });
               setProductList(productList.filter(f => f._id !== productSelectedToDelete._id!));

          } catch (err) {
               console.log('error: ', err)
               alertModal(err);
          }
     }

     const productImageBodyTemplate = (product: Product) => {
          return (<img loading="lazy" src={`https://res.cloudinary.com/${process.env.CLOUDINARY_NAME}/image/upload/c_fill,h_40,w_45/${product.public_id}?${Helper.RandomNumber(1, 1000)}`} alt={product.title} />);
     };

     const createdAtTemplate = (product: Product) => {
          return <span>{Helper.ConvertTimeZoneUTCToLocal(product.createdAt!)}</span>
     }

     const categoriesBodyTemplate = (category_id: string) => {
          return <span>{(categoryList.filter(f => f._id === category_id) as unknown as Category).categoryName}</span>;
     };


     return (
          <>
               <DataTable
                    className='dt-products'
                    value={productList}
                    header={renderHeader}
                    filters={filters}
                    onFilter={(e) => setFilters(e.filters)}
                    emptyMessage="No products found."
                    sortField="title"
                    sortOrder={1}
                    paginator
                    rowsPerPageOptions={[10, 25, 50]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                    rows={10}
                    dataKey="_id"
                    loading={isLoading}
                    tableStyle={{ minWidth: '50rem' }}
               >
                    <Column field="_id" hidden />
                    <Column body={productImageBodyTemplate} />
                    <Column field="category_id" header="Category" body={categoriesBodyTemplate} sortable />
                    <Column field="title" header="title" sortable />
                    <Column field="subTitle" header="subTitle" sortable />
                    <Column field="isActive" header="isActive" sortable />
                    <Column field="createdAt" header="Created at" sortable body={createdAtTemplate} />
                    <Column headerStyle={{ width: '5rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={optionsBodyTemplate} />
               </DataTable>
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
                    visible={showDeleteProductModal}
                    onHide={() => setShowDeleteProductModal(false)}
                    message={`Are you sure you want to proceed to delete the "${productSelectedToDelete.title}" product?`}
                    header="Confirmation"
                    icon="pi pi-exclamation-triangle"
                    acceptLabel="Eliminar"
                    rejectLabel="Cancelar"
                    acceptClassName="p-button p-component p-button-raised p-button-danger"
                    rejectClassName="p-button p-component p-button-outlined p-button-danger"
                    accept={acceptDeleteProduct}
               />
               <Toast ref={toast} />
               <Tooltip target=".custom-target-icon" />
               <BlockUI blocked={isLoading} fullScreen />
          </>
     )
}
export default ProductsDataTable