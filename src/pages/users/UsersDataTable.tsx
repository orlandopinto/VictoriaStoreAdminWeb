import { AxiosError } from "axios";
import { toPng } from 'html-to-image';
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { Sidebar } from "primereact/sidebar";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";
import { Tooltip } from 'primereact/tooltip';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ACTIONS } from "../../config/constants.d";
import { RoleController, UserController } from "../../controllers";
import { useAuth } from "../../hooks";
import { PermissionsByRole, Role, UserData } from "../../types";
import { CloudinaryResult } from "../../types/cloudinary-result.type";
import { ApiResultResponse } from '../../types/environment-response.type';
import { RegisterUser } from '../../types/user-data.type';
import { Validators } from "../../utils";
import { Helpers } from "../../utils/Helpers";
import ProfileImage from "./ProfileImage";
import { InputMask } from 'primereact/inputmask';
import { Divider } from "primereact/divider";
import { InputSwitch } from "primereact/inputswitch";

const UsersDataTable = () => {

     //..:: [ TYPES AND VARIABLES ] ::..
     type FilterRoleList = {
          id: string,
          roleName: string
     }
     const imageProfileRef = useRef<HTMLSpanElement | null>(null);
     const inputTextFirstNameRef = useRef<HTMLInputElement | null>(null);
     const inputTextLastNameRef = useRef<HTMLInputElement | null>(null);
     const inputTextEmailRef = useRef<HTMLInputElement | null>(null);
     const inputTextPhoneNumberRef = useRef<InputMask | null>(null);
     const inputTextPasswordRef = useRef<HTMLInputElement | null>(null);
     const inputTextConfirmPasswordRef = useRef<HTMLInputElement | null>(null);
     const profileImageBackgroundColors = ['#ffc75f', '#845ec2', '#d65db1', '#ff6f91', '#ff9671', '#2c73d2', '#0081cf', '#0089ba', '#008e9b', '#008f7a', '#4d8076', '#4b4453', '#b0a8b9', '#c34a36', '#4e8397']

     //..:: [ HOOKS ] ::..
     const navigate = useNavigate();
     const toast = useRef<Toast>(null);
     const { userLoggedData, hasAction, getPermissionList, isAllowed } = useAuth();

     //..:: [ STATES ] ::..
     const [userList, setUserList] = useState<UserData[]>([])
     const [roleList, setRoleList] = useState<Role[]>([])
     const [permissionsByRole, setPermissionsByRole] = useState([] as PermissionsByRole[])
     const [loading, setLoading] = useState<boolean>(true);
     const [, setVisibleRight] = useState<boolean>(false);
     const [overlayVisible, setOverlayVisible] = useState<boolean>(false);
     const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
     const [showOverlayAlertModal, setShowOverlayAlertModal] = useState(false);
     const [showDeleteRoleModal, setShowDeleteRoleModal] = useState(false);
     const [filterRoleList, setFilterRoleList] = useState<FilterRoleList[]>([]);
     const [profileName, setProfileName] = useState<[string, string]>(['?', '']);
     const [filters, setFilters] = useState<DataTableFilterMeta>({
          global: { value: null, matchMode: FilterMatchMode.CONTAINS },
          name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
          'email': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
          representative: { value: null, matchMode: FilterMatchMode.IN },
          status: { value: null, matchMode: FilterMatchMode.EQUALS },
          verified: { value: null, matchMode: FilterMatchMode.EQUALS }
     });
     const [isEdit, setIsEdit] = useState(false);
     const [profileImageBackgroundColor, setProfileImageBackgroundColor] = useState('')
     const [userDataToEdit, setUserDataToEdit] = useState<UserData>({} as UserData);
     const [activeUserSwitch, setActiveUserSwitch] = useState(false);
     const [changeToLoginSwitch, setChangeToLoginSwitch] = useState(true);

     useEffect(() => {
          getData()
     }, [])

     //..:: [ FUNCTIONS ] ::..

     const getData = async () => {
          if (!isAllowed(window.location.pathname.replace("/", ""))) {
               navigate('/errors/403')
          }

          setLoading(true)
          await loadUsersData();
          await loadRolesData();

          const permissionsByRole = getPermissionList(window.location.pathname.replace("/", ""));
          setPermissionsByRole(permissionsByRole as PermissionsByRole[]);
          setLoading(false);
     }

     const loadUsersData = async () => {
          try {
               const controller = new UserController(userLoggedData!)
               const data = await controller.GetUsers();
               setUserList(data as unknown as UserData[]);
          } catch (err) {
               console.log('error: ', err)
               const error = err as unknown as AxiosError
               const errorMessage = (error?.response?.data as any)
               if (errorMessage.message === 'Invalid Bearer token') {
                    alertModal();
               }
          }
     }

     const accept = () => {
          setShowOverlayAlertModal(false);
     }

     const loadRolesData = async () => {
          try {
               const controller = new RoleController(userLoggedData!);
               const data = await controller.GetRoles() as unknown as ApiResultResponse;
               let filterRoleList: FilterRoleList[] = []
               for (const role of (data.data as unknown as Role[])) {
                    filterRoleList.push({ roleName: role.roleName, id: role.id as string });
               }
               setFilterRoleList(filterRoleList);

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
                    group: 'overlayAlert',
                    message: err.errorMessage ? err.errorMessage : err.message,
                    header: 'Error',
                    icon: 'pi pi-exclamation-triangle',
                    defaultFocus: 'accept',
                    accept
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

     const deleteAlertConfirm = () => {
          confirmDialog({
               group: 'delete',
               message: 'Are you sure you want to proceed?',
               header: 'Confirmation',
               icon: 'pi pi-exclamation-triangle',
               defaultFocus: 'accept',
               //accept,
               //reject
          });
     };

     const initRegisterUserValues = (isCancel?: boolean) => {
          [
               inputTextFirstNameRef,
               inputTextLastNameRef,
               inputTextEmailRef,
               inputTextPhoneNumberRef,
               inputTextPasswordRef,
               inputTextConfirmPasswordRef
          ].forEach(ref => {
               if (ref.current) (ref.current as unknown as HTMLInputElement).value = "";
          });
          setProfileName(['?', '']);
          if (!isCancel)
               setProfileImageBackgroundColor(profileImageBackgroundColors[Helpers.RandomNumber(0, profileImageBackgroundColors.length)]);

          setRoleList([] as Role[]);
     }

     const openOverlay = (isEdit: boolean = false) => {
          setIsEdit(isEdit);
          setChangeToLoginSwitch(isEdit ? false : true);
          setOverlayVisible(true);
          initRegisterUserValues();
     }

     const renderHeader = () => {
          return (
               <div className="flex justify-content-between pt2">
                    <div>
                         <IconField iconPosition="left">
                              <InputIcon className="pi pi-search" />
                              <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar" className="p-inputtext-sm" />
                         </IconField>
                    </div>
                    <div><Button icon={"pi pi-plus"} label="Nuevo usuario" className="" onClick={() => openOverlay()}></Button></div>
               </div>
          );
     };

     const optionsBodyTemplate = (user: UserData) => {
          return (
               <div className="flex justify-content-end gap-2">
                    {permissionsByRole.length > 0 && hasAction(ACTIONS.EDIT) && user.firstName !== 'Administrator' && <Button icon="pi pi-lock-open" tooltip="Change password" tooltipOptions={{ position: 'top' }} rounded text onClick={() => setVisibleRight(true)} />}
                    {permissionsByRole.length > 0 && hasAction(ACTIONS.VIEW) && user.firstName !== 'Administrator' && <Button icon="pi pi-eye" tooltip="View" tooltipOptions={{ position: 'top' }} rounded text />}
                    {permissionsByRole.length > 0 && hasAction(ACTIONS.EDIT) && user.firstName !== 'Administrator' && <Button icon="pi pi-pencil" tooltip="Edit" rounded text tooltipOptions={{ position: 'top' }} onClick={() => {
                         openOverlay(true);
                         setActiveUserSwitch(user.isActive);
                         setUserDataToEdit(user);
                         const lista: Role[] = [];
                         for (const role of user.roles) {
                              const foundRole = filterRoleList.find(f => f.roleName === role)
                              lista.push({ id: foundRole?.id!, roleName: foundRole?.roleName!, roleDescription: "" });
                         }
                         setRoleList(lista);
                    }} />}
                    {permissionsByRole.length > 0 && hasAction(ACTIONS.DELETE) && user.firstName !== 'Administrator' && <Button icon="pi pi-trash" tooltip="Delete" rounded text tooltipOptions={{ position: 'top' }} onClick={deleteAlertConfirm} />}
               </div>
          );
     }

     const rolesBodyTemplate = (user: any) => {
          let ctrls: any[] = [];
          user.roles.map((it: any, index: number) => {
               ctrls.push(<Tag key={index} className='mr-1'>{it}</Tag>)
          })

          return ctrls
     };

     const userNameBodyTemplate = (user: UserData) => {
          return (
               <div className="flex align-items-center gap-2">
                    <img alt={user.imageProfilePath} src={user.imageProfilePath} style={{ width: '28px' }} />
                    <span>{user.firstName} {user.lastName}</span>
               </div>
          );
     };

     const statusBodyTemplate = (user: UserData) => {
          return user.firstName !== 'Administrator' ? (user.isActive ? <Tag value="Active" style={{ width: '60px' }} ></Tag> : <Tag severity="warning" value="Inactive" style={{ width: '60px' }}></Tag>) : ''
     }

     // const redirect = () => {
     //      logout();
     // }

     const customHeader = () => {
          return (
               <div className="flex justify-content-center w-full">
                    <span className="font-bold">{isEdit ? "EDIT USER" : "REGISTER USER"}</span>
               </div>
          )
     }

     const acceptDeleteRole = async () => {

          try {

               // const controller = new PageController(getToken());
               // const result = await controller.DeletePage(selectedPage) as unknown as ApiResultResponse
               // if (result.hasError) {
               //      const err = new Error(result.message);
               //      alertModal(err);
               //      return;
               // }
               // toast.current?.show({ severity: 'success', summary: 'Confirmed', detail: result.message, life: 3000 });
               // setPageList(pageList.filter(f => f.pageName !== selectedPage.pageName));
               // let permissionsProfileStateListTmp = getPermissionsProfileStateList().filter(f => f.permissionsByRole.map((p) => p.pageName !== selectedPage.pageName))
               // updatePermissionsProfile([...permissionsProfileStateListTmp]);
               // setSelectedPage({} as Page);

          } catch (err) {
               console.log('error: ', err)
               const error = err as unknown as AxiosError
               const errorMessage = (error?.response?.data as any).error
               if (errorMessage === 'Invalid Bearer token')
                    alertModal();
          }
     }

     const ulploadCloudinaryImage = async (): Promise<CloudinaryResult | undefined> => {
          try {

               let fileUpload = document.querySelector("input[type=file]") as unknown as HTMLInputElement;
               imageProfileRef.current = document.getElementsByClassName('user-profile-image')[0] as HTMLSpanElement;
               const imagen = await toPng(imageProfileRef.current, { cacheBust: false })
                    .then((dataUrl) => {
                         return dataUrl;
                    })
                    .catch((err) => {
                         console.log(err);
                    });

               const covertedFile = await Helpers.DataUrlToFile(imagen as unknown as string, `profile-image.png`);

               let dataTransfer = new DataTransfer();
               dataTransfer.items.add(covertedFile);

               fileUpload.files = dataTransfer.files;

               const controller = new UserController(userLoggedData!);

               let formData = new FormData();
               formData.append("file", dataTransfer.files[0]);
               const result = await controller.UploadImage(formData) as unknown as CloudinaryResult;
               return result;
          } catch (error) {
               console.log('error: ', error)
               return undefined;
          }
     }

     function allFieldsValid(formElements: HTMLFormControlsCollection): boolean {
          let counterInvalidFields = 0;
          for (const htmlElement of formElements) {
               let currentElement = htmlElement as unknown as HTMLElement;
               if ((currentElement as HTMLInputElement).value === '' && !(currentElement instanceof HTMLButtonElement) && (currentElement as HTMLInputElement).type !== 'file' && !currentElement.outerHTML.includes('combobox')) {
                    currentElement.classList.add('p-invalid');
                    counterInvalidFields++;
               }
               else if (currentElement.id === 'email') {
                    const emailErrorMessage = document.getElementById('email-error-message') as unknown as HTMLElement
                    if (!Validators.email.test((currentElement as HTMLInputElement).value)) {
                         emailErrorMessage.classList.remove('d-none');
                         counterInvalidFields++;
                    }
                    else
                         emailErrorMessage.classList.add('d-none');
               }
               else {
                    currentElement.classList.remove('p-invalid');
               }
          }
          return counterInvalidFields === 0;
     }

     const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const form = event.currentTarget;
          const formElements = form.elements as typeof form.elements & {
               email: { value: string }
          };

          if (!allFieldsValid(formElements)) return;

          const emailErrorMessage = document.getElementById('email-error-message') as HTMLElement;
          const passwordsErrorMessage = document.getElementById('passwords-error-message') as HTMLElement;
          const password = document.getElementById('password') as HTMLInputElement;
          const confirmPassword = document.getElementById('confirmPassword') as HTMLInputElement;

          let hasErrors = false;

          if (!Validators.email.test(formElements.email.value)) {
               emailErrorMessage.classList.remove('d-none');
               hasErrors = true;
          } else
               emailErrorMessage.classList.add('d-none');

          if (password.value !== confirmPassword.value) {
               passwordsErrorMessage.classList.remove('d-none');
               hasErrors = true;
          } else
               passwordsErrorMessage.classList.add('d-none');

          if (userList.some(user => user.email === inputTextEmailRef.current?.value)) {
               alertModal(new Error('User already exists'));
               hasErrors = true;
          }

          if (!hasErrors) RegisterUser();
     }

     const handleEditSubmit = (event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();
     }

     const validateEmailOnBlur = () => {
          const email = document.getElementById('email') as unknown as HTMLInputElement
          const emailErrorMessage = document.getElementById('email-error-message') as unknown as HTMLElement
          if (!Validators.email.test(email.value))
               emailErrorMessage.classList.remove('d-none');
          else
               emailErrorMessage.classList.add('d-none');
     }

     const validatePasswordsOnBlur = () => {
          const password = document.getElementById('password') as unknown as HTMLInputElement
          const confirmPassword = document.getElementById('confirmPassword') as unknown as HTMLInputElement
          const passwordsErrorMessage = document.getElementById('passwords-error-message') as unknown as HTMLElement
          if (password.value !== confirmPassword.value)
               passwordsErrorMessage.classList.remove('d-none');
          else
               passwordsErrorMessage.classList.add('d-none');
     }

     const RegisterUser = async () => {

          try {
               const profileImage = await ulploadCloudinaryImage();
               const controller = new UserController(userLoggedData!);
               const user: RegisterUser = {
                    email: inputTextEmailRef.current?.value!,
                    password: inputTextPasswordRef.current?.value!,
                    firstName: inputTextFirstNameRef.current?.value!,
                    lastName: inputTextLastNameRef.current?.value!,
                    phoneNumber: (inputTextPhoneNumberRef.current as unknown as HTMLInputElement).value,
                    imageProfilePath: profileImage?.secure_url!,
                    city: null,
                    zipcode: null,
                    lockoutEnabled: false,
                    accessFailedCount: 0,
                    address: null,
                    birthDate: null,
                    roles: roleList.map(f => f.roleName),
                    isActive: true
               }
               const result = await controller.Register(user) as unknown as ApiResultResponse
               if (result.hasError) {
                    alertModal(new Error(result.message));
                    return;
               }
               toast.current?.show({ severity: 'success', summary: 'Saved', detail: result.message, life: 3000 });
               setUserList([...userList, result.data as unknown as UserData])
               setOverlayVisible(false);

          } catch (error) {
               console.log('error: ', error);
          }

     }

     const multiSelectOnLoad = (e: any) => {
          const multiSelect = document.getElementById('roles-multiselect')
          const x = e;
     }

     return (
          <>
               <DataTable
                    className='dt-users'
                    value={userList}
                    header={renderHeader}
                    filters={filters}
                    onFilter={(e) => setFilters(e.filters)}
                    emptyMessage="No users found."
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
                    <Column field="firstName" header="Name" sortable body={userNameBodyTemplate} />
                    <Column field="email" header="Email" sortable />
                    <Column field="phoneNumber" header="Phone number" sortable />
                    <Column field="roles" header="roles" body={rolesBodyTemplate} sortable />
                    <Column field="createdAt" header="Created at" sortable />
                    <Column field="isActive" header="Status" body={statusBodyTemplate} sortable />
                    <Column headerStyle={{ width: '5rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={optionsBodyTemplate} />
               </DataTable>

               <Sidebar className="overlay-add-page w-full md:w-20rem lg:w-30rem" header={customHeader} visible={overlayVisible} position="right" onHide={() => setOverlayVisible(false)}>
                    {
                         isEdit
                              ?
                              <form onSubmit={handleEditSubmit}>
                                   <div className="py-2 w-full flex justify-content-center">
                                        <img src={userDataToEdit.imageProfilePath} className="user-profile-image" />
                                   </div>
                                   <div className="flex justify-content-center w-full pt-2 pb-4">
                                        <label htmlFor="email">{userDataToEdit.email}</label>
                                   </div>
                                   <div className="gap-2 flex-auto flex flex-row">
                                        PERSONAL DATA
                                   </div>
                                   <Divider />
                                   <div className="gap-2 flex-auto flex flex-row">
                                        <div className="flex flex-column gap-2 w-full">
                                             <label htmlFor="firstName">First name:</label>
                                             <InputText id="firstName" value={userDataToEdit.firstName} onChange={(e: ChangeEvent<HTMLInputElement>) => setProfileName([e.currentTarget.value, profileName[1]])} className='p-inputtext-sm w-full' aria-describedby="first-name" ref={inputTextFirstNameRef} />
                                        </div>
                                        <div className="flex flex-column gap-2 w-full">
                                             <label htmlFor="lastName">Last name:</label>
                                             <InputText id="lastName" value={userDataToEdit.lastName} onChange={(e: ChangeEvent<HTMLInputElement>) => setProfileName([profileName[0], e.currentTarget.value])} className='p-inputtext-sm w-full' aria-describedby="last-name" ref={inputTextLastNameRef} />
                                        </div>
                                   </div>
                                   <div className="gap-2 flex-auto flex flex-row pt-3">
                                        <div className="flex flex-column gap-2 w-full">
                                             <label htmlFor="phoneNumber">Phone number:</label>
                                             <InputMask id="phoneNumber" value={userDataToEdit.phoneNumber} mask="999 99 99 99" placeholder="___ __ __ __" className='p-inputtext-sm w-full' aria-describedby="phone-number" ref={inputTextPhoneNumberRef} />
                                        </div>
                                   </div>
                                   <div className="gap-2 flex-auto flex flex-row pt-3">
                                        <div className="flex flex-column gap-2 w-full">
                                             <label htmlFor="role">Roles:</label>
                                             <MultiSelect id="roles-multiselect" value={roleList} onBlur={(e) => multiSelectOnLoad(e)} onChange={(e) => setRoleList(e.value)} options={filterRoleList} optionLabel="roleName" placeholder="Select role" maxSelectedLabels={3} className="w-full" />
                                        </div>
                                   </div>
                                   <div className="gap-2 flex justify-content-end  pt-4">
                                        {activeUserSwitch ? <div style={{ width: '120px' }}>Deshabilitar usuario</div> : <div style={{ width: '120px' }}>Habilitar usuario</div>}
                                        <div><InputSwitch checked={activeUserSwitch} onChange={(e) => setActiveUserSwitch(e.value)} /></div>
                                   </div>
                                   <div className="gap-2 flex-auto flex flex-row pt-3">
                                        RESET PASSWORD
                                   </div>
                                   <Divider />
                                   <div className="gap-2 flex-auto flex flex-row ">
                                        <div className="flex flex-column gap-2 w-full">
                                             <label htmlFor="password">Password:</label>
                                             <InputText id="password" type="password" value={userDataToEdit.password} className='p-inputtext-sm w-full' ref={inputTextPasswordRef} autoComplete="new-password" style={{ height: '2.4rem' }} />
                                        </div>
                                        <div className="flex flex-column gap-2 w-full">
                                             <label htmlFor="confirmPassword">Confirm password:</label>
                                             <InputText id="confirmPassword" type="password" value={userDataToEdit.password} className='p-inputtext-sm w-full' ref={inputTextConfirmPasswordRef} onBlur={validatePasswordsOnBlur} />
                                        </div>
                                   </div>
                                   <div className="w-full pb-3">
                                        <small id="passwords-error-message" className="invalid-text-color d-none">
                                             Password and Confirm password doesn't match.
                                        </small>
                                   </div>
                                   <div className="gap-2 flex pt-4">
                                        <div><InputSwitch checked={changeToLoginSwitch} onChange={(e) => setChangeToLoginSwitch(e.value)} /></div>
                                        <div>Cambiar contraseña al iniciar sesión</div>
                                   </div>
                                   <div className="absolute bottom-0 p-2 w-full gap-2 justify-content-endabsolute bottom-0  w-full gap-2 flex justify-content-end pr-6 pb-3">
                                        <div>
                                             <Button id="btnCancel" type="button" label="Cancel" outlined severity="secondary" className="w-7rem" onClick={() => {
                                                  initRegisterUserValues(true);
                                                  setOverlayVisible(false);
                                             }} />
                                        </div>
                                        <div>
                                             <Button id="btnSaveUser" type="submit" label="Actualizar" className="w-7rem" />
                                        </div>
                                   </div>
                              </form>
                              :
                              <form onSubmit={handleSubmit}>
                                   <div className="pt-4 pb-6 w-full flex justify-content-center">
                                        <ProfileImage fullName={profileName} profileImageBackgroundColor={profileImageBackgroundColor} ref={imageProfileRef} />
                                   </div>
                                   <div className="gap-2 flex-auto flex flex-row">
                                        <div className="flex flex-column gap-2 w-full">
                                             <label htmlFor="firstName">First name:</label>
                                             <InputText id="firstName" onChange={(e: ChangeEvent<HTMLInputElement>) => setProfileName([e.currentTarget.value, profileName[1]])} className='p-inputtext-sm w-full' aria-describedby="first-name" ref={inputTextFirstNameRef} />
                                        </div>
                                        <div className="flex flex-column gap-2 w-full">
                                             <label htmlFor="lastName">Last name:</label>
                                             <InputText id="lastName" onChange={(e: ChangeEvent<HTMLInputElement>) => setProfileName([profileName[0] === '' ? '?' : profileName[0], e.currentTarget.value])} className='p-inputtext-sm w-full' aria-describedby="last-name" ref={inputTextLastNameRef} />
                                        </div>
                                   </div>
                                   <div className="gap-2 flex-auto flex flex-row pt-4">
                                        <div className="flex flex-column gap-2 w-full">
                                             <label htmlFor="email">Email:</label>
                                             <InputText id="email" onBlur={validateEmailOnBlur} className='p-inputtext-sm w-full' aria-describedby="email" autoComplete="off" ref={inputTextEmailRef} style={{ height: '2.4rem' }} />
                                             <small id="email-error-message" className="invalid-text-color d-none">
                                                  email invalid.
                                             </small>
                                        </div>
                                   </div>
                                   <div className="gap-2 flex-auto flex flex-row pt-3">
                                        <div className="flex flex-column gap-2 w-full">
                                             <label htmlFor="phoneNumber">Phone number:</label>
                                             <InputMask id="phoneNumber" mask="999 99 99 99" placeholder="___ __ __ __" className='p-inputtext-sm w-full' aria-describedby="phone-number" ref={inputTextPhoneNumberRef} />
                                        </div>
                                   </div>
                                   <div className="gap-2 flex-auto flex flex-row pt-3">
                                        <div className="flex flex-column gap-2 w-full">
                                             <label htmlFor="role">Roles:</label>
                                             <MultiSelect value={roleList} onChange={(e) => setRoleList(e.value)} options={filterRoleList} optionLabel="roleName" placeholder="Select role" maxSelectedLabels={3} className="w-full" />
                                        </div>
                                   </div>
                                   <div className="gap-2 flex-auto flex flex-row pt-4">
                                        <div className="flex flex-column gap-2 w-full">
                                             <label htmlFor="password">Password:</label>
                                             <InputText id="password" type="password" className='p-inputtext-sm w-full' ref={inputTextPasswordRef} autoComplete="new-password" style={{ height: '2.4rem' }} />
                                        </div>
                                        <div className="flex flex-column gap-2 w-full">
                                             <label htmlFor="confirmPassword">Confirm password:</label>
                                             <InputText id="confirmPassword" type="password" className='p-inputtext-sm w-full' ref={inputTextConfirmPasswordRef} onBlur={validatePasswordsOnBlur} />
                                        </div>
                                   </div>
                                   <div className="w-full pb-3">
                                        <small id="passwords-error-message" className="invalid-text-color d-none">
                                             Password and Confirm password doesn't match.
                                        </small>
                                   </div>
                                   <div className="gap-2 flex pt-4">
                                        <div><InputSwitch checked={changeToLoginSwitch} onChange={(e) => setChangeToLoginSwitch(e.value)} /></div>
                                        <div>Cambiar contraseña al iniciar sesión</div>
                                   </div>
                                   <div className="d-none">
                                        <input type="file" id="file" className="p-fileupload" />
                                        {/* <Button label="upload image" onClick={handleFileUpload} /> */}
                                   </div>
                                   <div className="absolute bottom-0 p-2 w-full gap-2 justify-content-endabsolute bottom-0  w-full gap-2 flex justify-content-end pr-6 pb-3">
                                        <div>
                                             <Button id="btnCancel" type="button" label="Cancel" outlined severity="secondary" className="w-7rem" onClick={() => {
                                                  initRegisterUserValues(true);
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
                    group="declarative"
                    visible={showDeleteRoleModal}
                    onHide={() => setShowDeleteRoleModal(false)}
                    message={`Are you sure you want to proceed to delete this user?`}
                    header="Confirmation"
                    icon="pi pi-exclamation-triangle"
                    acceptLabel="Eliminar"
                    rejectLabel="Cancelar"
                    acceptClassName="p-button p-component p-button-raised p-button-danger"
                    rejectClassName="p-button p-component p-button-outlined p-button-danger"
                    accept={acceptDeleteRole}
               />
               <Toast ref={toast} />
               <Tooltip target=".custom-target-icon" />
          </>
     )
}

export default UsersDataTable;