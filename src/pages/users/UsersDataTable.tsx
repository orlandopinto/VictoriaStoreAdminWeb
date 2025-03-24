import { toPng } from 'html-to-image';
import { FilterMatchMode } from "primereact/api";
import { Sidebar } from "primereact/sidebar";
import { Toast } from "primereact/toast";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Column, confirmDialog, ConfirmDialog, DataTable, DataTableFilterMeta, IconField, InputIcon, InputMask, InputSwitch, InputText, MultiSelect, MultiSelectChangeEvent, TabPanel, TabView, Tag, Tooltip } from "../../components/primereact";
import { ACTIONS, PROFILE_FOLDER_TO_UPLOAD } from "../../config/constants.d";
import { RoleController, UserController } from "../../controllers";
import { useAuth } from "../../hooks";
import { ChangePassword, PermissionsByRole, RegisterUser, Role, UpdateUser, UserData } from "../../types";
import { CloudinaryResult } from "../../types/cloudinary-result.type";
import { ApiResultResponse } from '../../types/environment-response.type';
import { Validators } from "../../utils";
import { Helper } from "../../utils/Helper";
import ProfileImage from "./ProfileImage";

const UsersDataTable = () => {

     //..:: [ TYPES AND VARIABLES ] ::..
     type FilterRoleList = {
          _id: string,
          roleName: string
     }
     const imageProfileRef = useRef<HTMLSpanElement | null>(null);

     //NEW USER
     const inputTextFirstNameRef = useRef<HTMLInputElement | null>(null);
     const inputTextLastNameRef = useRef<HTMLInputElement | null>(null);
     const inputTextEmailRef = useRef<HTMLInputElement | null>(null);
     const inputTextPhoneNumberRef = useRef<InputMask | null>(null);
     const inputTextPasswordRef = useRef<HTMLInputElement | null>(null);
     const inputTextConfirmPasswordRef = useRef<HTMLInputElement | null>(null);

     //EDIT USER
     const inputTextEditFirstNameRef = useRef<HTMLInputElement | null>(null);
     const inputTextEditLastNameRef = useRef<HTMLInputElement | null>(null);
     const inputTexEditPhoneNumberRef = useRef<InputMask | null>(null);
     const inputTextEditPasswordRef = useRef<HTMLInputElement | null>(null);
     const inputTextEditConfirmPasswordRef = useRef<HTMLInputElement | null>(null);

     const profileImageBackgroundColors = ['#ffc75f', '#845ec2', '#d65db1', '#ff6f91', '#ff9671', '#2c73d2', '#0081cf', '#0089ba', '#008e9b', '#008f7a', '#4d8076', '#4b4453', '#b0a8b9', '#c34a36', '#4e8397']

     //..:: [ HOOKS ] ::..
     const navigate = useNavigate();
     const toast = useRef<Toast>(null);
     const { userLoggedData, hasAction, getPermissionList, isAllowed } = useAuth();

     //..:: [ STATES ] ::..
     const [userList, setUserList] = useState<UserData[]>([])
     const [roleList, setRoleList] = useState<FilterRoleList[]>([] as FilterRoleList[])
     const [permissionsByRole, setPermissionsByRole] = useState([] as PermissionsByRole[])
     const [loading, setLoading] = useState<boolean>(true);
     //const [, setVisibleRight] = useState<boolean>(false);
     const [overlayVisible, setOverlayVisible] = useState<boolean>(false);
     const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
     const [showOverlayAlertModal, setShowOverlayAlertModal] = useState(false);
     const [userSelectedToDelete, setUserSelectedToDelete] = useState<UserData>({} as UserData)
     const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
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
     const [editFirstName, setEditFirstName] = useState('');
     const [editLastName, setEditLastName] = useState('');
     const [editPassword, setEditPassword] = useState('');
     const [editConfirmPassword, setEditConfirmPassword] = useState('');

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
               alertModal(err);
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
                    filterRoleList.push({ roleName: role.roleName, _id: role._id as string });
               }
               setFilterRoleList(filterRoleList);

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
          setEditFirstName('');
          setEditLastName('');
          if (!isCancel)
               setProfileImageBackgroundColor(profileImageBackgroundColors[Helper.RandomNumber(0, profileImageBackgroundColors.length)]);

          setRoleList([]);
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
                              <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar" className="p-inputtext-sm" style={{ width: '100%' }} />
                         </IconField>
                    </div>
                    {permissionsByRole.length > 0 && hasAction(ACTIONS.CREATE) && <div><Button icon={"pi pi-plus"} label="Nuevo usuario" className="" onClick={() => openOverlay()}></Button></div>}
               </div>
          );
     };

     const optionsBodyTemplate = (user: UserData) => {
          return (
               <div className="flex justify-content-end gap-2">
                    {permissionsByRole.length > 0 && hasAction(ACTIONS.VIEW) && user.firstName !== 'Administrator' && <Button icon="pi pi-eye" tooltip="View" tooltipOptions={{ position: 'top' }} rounded text />}
                    {permissionsByRole.length > 0 && hasAction(ACTIONS.EDIT) && user.firstName !== 'Administrator' && <Button icon="pi pi-pencil" tooltip="Edit" rounded text tooltipOptions={{ position: 'top' }} onClick={() => {
                         openOverlay(true);
                         setActiveUserSwitch(user.isActive);
                         setUserDataToEdit(user);
                         const roleByUserList: FilterRoleList[] = [];
                         for (const role of user.roles) {
                              const foundRole = filterRoleList.find(f => f.roleName === role)
                              roleByUserList.push({ _id: foundRole?._id!, roleName: foundRole?.roleName! })
                         }
                         setRoleList(roleByUserList);
                    }} />}
                    {permissionsByRole.length > 0 && hasAction(ACTIONS.DELETE) && user.firstName !== 'Administrator' && <Button icon="pi pi-trash" tooltip="Delete" rounded text tooltipOptions={{ position: 'top' }}
                         onClick={() => {
                              setUserSelectedToDelete(user)
                              setShowDeleteUserModal(true)
                         }} />
                    }
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
                    <img alt={user.secure_url} src={user.secure_url} style={{ width: '28px' }} />
                    <span>{user.firstName} {user.lastName}</span>
               </div>
          );
     };

     const statusBodyTemplate = (user: UserData) => {
          return user.firstName !== 'Administrator' ? (user.isActive ? <Tag value="Active" style={{ width: '60px' }} ></Tag> : <Tag severity="warning" value="Inactive" style={{ width: '60px' }}></Tag>) : ''
     }

     const customHeader = () => {
          return (
               <div className="pl-3 w-full">
                    <span className="font-bold">{isEdit ? "EDIT USER" : "NEW USER"}</span>
               </div>
          )
     }

     const acceptDeleteRole = async () => {

          try {

               const controller = new UserController(userLoggedData!);
               const result = await controller.Delete(userSelectedToDelete) as unknown as ApiResultResponse
               if (result.hasError) {
                    const err = new Error(result.message);
                    alertModal(err);
                    return;
               }
               toast.current?.show({ severity: 'success', summary: 'Deleted', detail: result.message, life: 3000 });
               setUserList(userList.filter(f => f._id !== userSelectedToDelete._id!));
               setOverlayVisible(false);

          } catch (err) {
               console.log('error: ', err)
               alertModal(err);
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

               const covertedFile = await Helper.DataUrlToFile(imagen as unknown as string, `profile-image.png`);

               let dataTransfer = new DataTransfer();
               dataTransfer.items.add(covertedFile);

               fileUpload.files = dataTransfer.files;

               const controller = new UserController(userLoggedData!);

               let formData = new FormData();
               formData.append("file", dataTransfer.files[0]);
               formData.append("folder", PROFILE_FOLDER_TO_UPLOAD);
               const result = await controller.UploadImage(formData) as unknown as CloudinaryResult;
               return result;
          } catch (err) {
               console.log('error: ', err)
               alertModal(err);
          }
     }

     const allFieldsValid = (formElements: HTMLFormControlsCollection): boolean => {
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
          const formElements = form.elements as typeof form.elements & { email: { value: string } };

          if (!allFieldsValid(formElements)) return;

          const emailErrorMessage = document.getElementById('email-error-message') as HTMLElement;
          const passwordsErrorMessage = document.getElementById('passwords-error-message') as HTMLElement;
          const password = document.getElementById('password') as HTMLInputElement;
          const confirmPassword = document.getElementById('confirmPassword') as HTMLInputElement;

          const emailValid = Validators.email.test(formElements.email.value);
          const passwordsMatch = password.value === confirmPassword.value;

          emailErrorMessage.classList.toggle('d-none', emailValid);
          passwordsErrorMessage.classList.toggle('d-none', passwordsMatch);

          if (emailValid && passwordsMatch) createNewUser();
     }

     const handleEditSubmit = (event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          updateUser();
     }

     const validateEmailOnBlur = () => {
          const email = document.getElementById('email') as HTMLInputElement;
          const emailErrorMessage = document.getElementById('email-error-message') as HTMLElement;
          emailErrorMessage.classList.toggle('d-none', Validators.email.test(email.value));
     }

     const validatePasswordsOnBlur = () => {
          const password = document.getElementById('password') as HTMLInputElement;
          const confirmPassword = document.getElementById('confirmPassword') as HTMLInputElement;
          const passwordsErrorMessage = document.getElementById('passwords-error-message') as HTMLElement;
          const hasErrors = password.value !== confirmPassword.value;
          passwordsErrorMessage.classList.toggle('d-none', !hasErrors);
          password.classList.toggle('p-invalid', hasErrors);
          confirmPassword.classList.toggle('p-invalid', hasErrors);
     }

     const validateEditPasswordsOnBlur = (): boolean => {
          const editPassword = document.getElementById('editPassword') as HTMLInputElement;
          const confirmEditPassword = document.getElementById('confirmEditPassword') as HTMLInputElement;
          const passwordsErrorMessage = document.getElementById('edit-passwords-error-message') as HTMLElement;
          const hasErrors = editPassword.value === '' || confirmEditPassword.value === '' || editPassword.value !== confirmEditPassword.value;
          passwordsErrorMessage.classList.toggle('d-none', !hasErrors);
          editPassword.classList.toggle('p-invalid', hasErrors);
          confirmEditPassword.classList.toggle('p-invalid', hasErrors);
          return hasErrors;
     }

     const createNewUser = async () => {

          try {
               const profileImage = await ulploadCloudinaryImage();
               const controller = new UserController(userLoggedData!);
               const user: RegisterUser = {
                    email: inputTextEmailRef.current?.value!,
                    password: inputTextPasswordRef.current?.value!,
                    firstName: inputTextFirstNameRef.current?.value!,
                    lastName: inputTextLastNameRef.current?.value!,
                    phoneNumber: (inputTextPhoneNumberRef.current as unknown as HTMLInputElement).value,
                    public_id: profileImage?.public_id!,
                    secure_url: profileImage?.secure_url!,
                    city: null,
                    zipcode: null,
                    lockoutEnabled: false,
                    accessFailedCount: 0,
                    address: null,
                    birthDate: null,
                    roles: roleList.map(f => f.roleName),
                    isActive: true
               }
               const result = await controller.Create(user) as unknown as ApiResultResponse
               if (result.hasError) {
                    alertModal(new Error(result.message));
                    return;
               }
               toast.current?.show({ severity: 'success', summary: 'Saved', detail: result.message, life: 3000 });
               setUserList([...userList, result.data as unknown as UserData])
               setOverlayVisible(false);

          } catch (err) {
               console.log('error: ', err)
               alertModal(err);
          }

     }

     const updateUser = async () => {

          try {
               const controller = new UserController(userLoggedData!);
               const user: UpdateUser = {
                    id: userDataToEdit._id!,
                    address: userDataToEdit.address,
                    firstName: inputTextEditFirstNameRef.current?.value!,
                    lastName: inputTextEditLastNameRef.current?.value!,
                    phoneNumber: (inputTexEditPhoneNumberRef.current as unknown as HTMLInputElement).value,
                    public_id: userDataToEdit.public_id,
                    secure_url: userDataToEdit.secure_url,
                    city: userDataToEdit.city,
                    zipcode: userDataToEdit.zipcode,
                    lockoutEnabled: userDataToEdit.lockoutEnabled,
                    accessFailedCount: userDataToEdit.accessFailedCount!,
                    birthDate: userDataToEdit.birthDate,
                    roles: roleList.map(f => f.roleName),
                    isActive: activeUserSwitch
               }
               const result = await controller.Update(user) as unknown as ApiResultResponse
               if (result.hasError) {
                    alertModal(new Error(result.message));
                    return;
               }
               toast.current?.show({ severity: 'success', summary: 'updated', detail: result.message, life: 3000 });

               for (let usr of userList) {
                    if (usr._id === user.id) {
                         usr.firstName = user.firstName;
                         usr.lastName = user.lastName;
                         usr.phoneNumber = user.phoneNumber;
                         usr.roles = user.roles!;
                         usr.isActive = user.isActive!;
                    }
               }
               setUserList(userList)
               setOverlayVisible(false);

          } catch (err) {
               console.log('error: ', err)
               alertModal(err);
          }

     }

     const handleChangePasswordSubmit = (event: FormEvent<HTMLFormElement>) => {

          event.preventDefault();
          if (!validateEditPasswordsOnBlur())
               changePassword();

     }

     const changePassword = async () => {
          try {
               const controller = new UserController(userLoggedData!);
               const params: ChangePassword = {
                    email: userDataToEdit.email,
                    newPassword: inputTextEditConfirmPasswordRef.current?.value!,
               }
               const result = await controller.ChangePassword(params) as unknown as ApiResultResponse
               if (result.hasError) throw new Error(result.message);
               toast.current?.show({ severity: 'success', summary: 'updated', detail: result.message, life: 3000 });
               setOverlayVisible(false);
          } catch (err) {
               alertModal(err);
          }
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
                              <>
                                   <div className="py-2 w-full flex justify-content-center">
                                        <img src={userDataToEdit.secure_url} className="user-profile-image" />
                                   </div>
                                   <div className="flex justify-content-center w-full pt-2 pb-4">
                                        <label htmlFor="email">{userDataToEdit.email}</label>
                                   </div>
                                   <TabView>
                                        <TabPanel header="User data">
                                             <form onSubmit={handleEditSubmit}>
                                                  <div className="gap-2 flex-auto flex flex-row">
                                                       <div className="flex flex-column gap-2 w-full">
                                                            <label htmlFor="editFirstName">First name:</label>
                                                            <InputText
                                                                 id="editFirstName"
                                                                 ref={inputTextEditFirstNameRef}
                                                                 value={editFirstName || userDataToEdit.firstName}
                                                                 onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditFirstName(e.currentTarget.value)}
                                                                 className='p-inputtext-sm w-full'
                                                                 aria-describedby="edit-first-name"
                                                            />
                                                       </div>
                                                       <div className="flex flex-column gap-2 w-full">
                                                            <label htmlFor="lastName">Last name:</label>
                                                            <InputText
                                                                 id="editLastName"
                                                                 ref={inputTextEditLastNameRef}
                                                                 value={editLastName || userDataToEdit.lastName}
                                                                 onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditLastName(e.currentTarget.value)}
                                                                 className='p-inputtext-sm w-full'
                                                                 aria-describedby="last-name"
                                                            />
                                                       </div>
                                                  </div>
                                                  <div className="gap-2 flex-auto flex flex-row pt-3">
                                                       <div className="flex flex-column gap-2 w-full">
                                                            <label htmlFor="editPhoneNumber">Phone number:</label>
                                                            <InputMask id="editPhoneNumber" value={userDataToEdit.phoneNumber} ref={inputTexEditPhoneNumberRef} mask="999 99 99 99" placeholder="___ __ __ __" className='p-inputtext-sm w-full' aria-describedby="phone-number" />
                                                       </div>
                                                  </div>
                                                  <div className="gap-2 flex-auto flex flex-row pt-3">
                                                       <div className="flex flex-column gap-2 w-full">
                                                            <label htmlFor="role">Roles:</label>
                                                            <MultiSelect id="roles-multiselect" value={roleList} onChange={(e: MultiSelectChangeEvent) => setRoleList(e.value)} options={filterRoleList} optionLabel="roleName" placeholder="Select role" maxSelectedLabels={3} className="w-full" />
                                                       </div>
                                                  </div>
                                                  <div className="gap-2 flex justify-content-end pt-4">
                                                       {activeUserSwitch ? <div style={{ width: '120px' }}>Deshabilitar usuario</div> : <div style={{ width: '120px' }}>Habilitar usuario</div>}
                                                       <div><InputSwitch checked={activeUserSwitch} onChange={(e) => setActiveUserSwitch(e.value)} /></div>
                                                  </div>
                                                  <div className="absolute bottom-0 p-2 w-full gap-2 justify-content-endabsolute bottom-0  w-full gap-2 flex justify-content-end pr-6 pb-3">
                                                       <div>
                                                            <Button id="btnCancel" type="button" label="Cancel" outlined severity="secondary" className="w-7rem" onClick={() => {
                                                                 initRegisterUserValues(true);
                                                                 setOverlayVisible(false);
                                                            }} />
                                                       </div>
                                                       <div>
                                                            <Button id="btnUpdateUser" type="submit" label="Actualizar" className="w-7rem" />
                                                       </div>
                                                  </div>
                                             </form>
                                        </TabPanel>
                                        <TabPanel header="Change Password">
                                             <form onSubmit={handleChangePasswordSubmit}>
                                                  <div className="reset-password-section">
                                                       <div className="gap-2 flex-auto flex flex-row ">
                                                            <div className="flex flex-column gap-2 w-full">
                                                                 <label htmlFor="editPassword">Password:</label>
                                                                 <InputText
                                                                      id="editPassword"
                                                                      type="password"
                                                                      value={editPassword}
                                                                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditPassword(e.currentTarget.value)}
                                                                      className='p-inputtext-sm w-full'
                                                                      ref={inputTextEditPasswordRef}
                                                                      autoComplete="new-password" style={{ height: '2.4rem' }} />
                                                            </div>
                                                            <div className="flex flex-column gap-2 w-full">
                                                                 <label htmlFor="confirmEditPassword">Confirm password:</label>
                                                                 <InputText
                                                                      id="confirmEditPassword"
                                                                      type="password"
                                                                      value={editConfirmPassword}
                                                                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditConfirmPassword(e.currentTarget.value)}
                                                                      className='p-inputtext-sm w-full'
                                                                      ref={inputTextEditConfirmPasswordRef}
                                                                      onBlur={validateEditPasswordsOnBlur} />
                                                            </div>
                                                       </div>
                                                       <div className="w-full pb-3">
                                                            <small id="edit-passwords-error-message" className="invalid-text-color d-none">
                                                                 Password and Confirm password doesn't match.
                                                            </small>
                                                       </div>
                                                       <div className="gap-2 flex pt-4">
                                                            <div><InputSwitch checked={changeToLoginSwitch} onChange={(e) => setChangeToLoginSwitch(e.value)} /></div>
                                                            <div>Cambiar contraseña al iniciar sesión</div>
                                                       </div>
                                                  </div>
                                                  <div className="absolute bottom-0 p-2 w-full gap-2 justify-content-endabsolute bottom-0  w-full gap-2 flex justify-content-end pr-6 pb-3">
                                                       <div>
                                                            <Button id="btnCancel" type="button" label="Cancel" outlined severity="secondary" className="w-7rem" onClick={() => {
                                                                 initRegisterUserValues(true);
                                                                 setOverlayVisible(false);
                                                            }} />
                                                       </div>
                                                       <div>
                                                            <Button id="btnSaveUser" type="submit" label="Change password" />
                                                       </div>
                                                  </div>
                                             </form>
                                        </TabPanel>
                                   </TabView>
                              </>
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
                    group="ConfirmDialogDelete"
                    visible={showDeleteUserModal}
                    onHide={() => setShowDeleteUserModal(false)}
                    message={`Are you sure you want to proceed to delete the "${userSelectedToDelete.firstName} ${userSelectedToDelete.lastName}" user?`}
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