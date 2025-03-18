import { AxiosError } from 'axios';
import { FilterMatchMode } from 'primereact/api';
import { Toast } from 'primereact/toast';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Accordion, AccordionTab, Button, Column, confirmDialog, ConfirmDialog, DataTable, DataTableFilterMeta, Dialog, Divider, IconField, InputIcon, InputSwitch, InputSwitchChangeEvent, InputText, InputTextarea, Message, PickList, PickListChangeEvent, Stepper, StepperPanel, StepperRefAttributes, TabPanel, TabView, TabViewTabChangeEvent } from '../../components/primereact/index';
import { ACTIONS, DEFAULT_USER_IMAGE } from '../../config/constants.d';
import { ActionController, PageController, PermissionController, RoleController, UserController } from '../../controllers';
import { useAuth } from "../../hooks";
import { usePermissionStore } from '../../stores/usePermissionStore';
import { Action, ApiResultResponse, Page, PermissionsByRole, PermissionsProfile, Role, UserData, UsersByRole } from '../../types';
import { groupBy } from '../../utils';
import PagesDataTable from '../pages/PagesDataTable';
import UsersDataTable from '../users/UsersDataTable';
import './index.css';

const IndexRoles = () => {

     //..:: [ TYPES AND INTERFACES ] ::..
     type CounterActionsByPage = {
          pageName: string,
          counter: number,
          pageId: string
     }

     interface RolesStpperProps {
          isEditing: boolean;
          role?: Role;
     }

     type PermissionsByRoleData = {
          role: Role,
          permissionsByRole: PermissionsByRole[],
          counterPages: number,
          usersByRole: UsersByRole[],
          counterUsers: number
     }

     //..:: [ VARIABLES ] ::..
     let counterActionsByPage: CounterActionsByPage[] = [];
     const stepperRef = useRef<StepperRefAttributes>(null);
     const userStore = usePermissionStore()

     //..:: [ HOOKS ] ::..
     //WARNING: ..:: [ Las siguientes lineas son obligatiorias para ejecutar los permisos ]::..
     const { userLoggedData, hasAction, getPermissionList, isAllowed, getPermissionsProfileStateList, updatePermissionsProfile } = useAuth();
     const navigate = useNavigate();
     const toast = useRef<Toast>(null);

     //..:: [ STATES ] ::..
     const [userList, setUserList] = useState<UserData[]>([])
     const [roleData, setRoleData] = useState([] as Role[])
     const [pagesData, setPagesData] = useState([] as Page[])
     const [actionsData, setActionsData] = useState([] as Action[])
     const [permissionsByRole, setPermissionsByRole] = useState([] as PermissionsByRole[])
     const [loading, setLoading] = useState<boolean>(true);
     const [tabActiveIndex, setTabActiveIndex] = useState<number>(0);
     const [showAlertModal, setShowAlertModal] = useState(false)

     //..::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..

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
          await loadRoleData();
          await loadPagesData();
          await loadActionsData();

          const permissionsByRole = getPermissionList(window.location.pathname.replace("/", ""))
          setPermissionsByRole(permissionsByRole as PermissionsByRole[])
          setLoading(false)
     }

     const loadUsersData = async () => {
          try {
               const controller = new UserController(userLoggedData!)
               const data = await controller.GetUsers();
               setUserList(data as unknown as UserData[])

          } catch (err) {
               console.log('error: ', err)
               const error = err as unknown as AxiosError
               const errorMessage = (error?.response?.data as any).error
               if (errorMessage === 'Invalid Bearer token')
                    alertModal();
          }
     }

     const loadRoleData = async () => {
          try {
               const controller = new RoleController(userLoggedData!)
               const data = await controller.GetRoles() as unknown as ApiResultResponse;
               setRoleData(data?.data as unknown as Role[])

          } catch (err) {
               console.log('error: ', err)
               const error = err as unknown as AxiosError
               const errorMessage = (error?.response?.data as any).error
               if (errorMessage === 'Invalid Bearer token')
                    alertModal();
          }
     }

     const loadPagesData = async () => {
          try {
               const controller = new PageController(userLoggedData!)
               const data = await controller.GetPages() as unknown as ApiResultResponse;
               setPagesData(data?.data as unknown as Page[])
          } catch (err) {
               console.log('error: ', err)
               const error = err as unknown as AxiosError
               const errorMessage = (error?.response?.data as any).error
               if (errorMessage === 'Invalid Bearer token') {
                    alertModal();
               }
          }
     }

     const loadActionsData = async () => {
          try {
               const controller = new ActionController(userLoggedData!)
               const data = await controller.GetActions() as unknown as ApiResultResponse;
               setActionsData(data?.data as unknown as Action[])

          } catch (err) {
               console.log('error: ', err)
               const error = err as unknown as AxiosError
               const errorMessage = (error?.response?.data as any).error
               if (errorMessage === 'Invalid Bearer token')
                    alertModal();
          }
     }

     const accept = () => {
          setShowAlertModal(false);
     }

     const alertModal = (err?: any) => {
          if (err) {
               confirmDialog({
                    group: 'alert',
                    message: err.errorMessage ? err.errorMessage : err.message,
                    header: 'Error',
                    icon: 'pi pi-exclamation-triangle',
                    defaultFocus: 'accept',
                    accept
               });
          }
          else {
               confirmDialog({
                    group: 'alert',
                    message: 'La session ha caducado, debe iniciar sesión nuevamente.',
                    header: 'iniciar sesión',
                    icon: 'pi pi-exclamation-triangle',
                    defaultFocus: 'accept',
                    //reject: closeModal
               });
          }
     };

     const RoleStep = ({ isEditing }: RolesStpperProps) => {

          const inputTextRef = useRef<HTMLInputElement | null>(null);
          const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
          const [showRoleNameMessage, setShowRoleNameMessage] = useState(false)
          const [formData, setFormData] = useState<Role>({} as Role);
          const [visibleRoleExistMessage, setVisibleRoleExistMessage] = useState<boolean>(false);

          const userStore = usePermissionStore()

          useEffect(() => {
               if (userStore.role) {
                    if (userStore.role.roleName)
                         setFormData({ id: userStore.role.id, roleName: userStore.role.roleName, roleDescription: userStore.role.roleDescription });
               }
          }, []);

          const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
               setFormData({ ...formData, [event.target.id]: event.target.value });
          };

          const handleTextAreaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
               setFormData({ ...formData, [event.target.id]: event.target.value });
          };

          const validateRole = () => {
               if (roleData.find(f => f.roleName === formData.roleName) && !isEditing) {
                    setVisibleRoleExistMessage(true);
                    return;
               }
               else if (!formData.roleName) {
                    inputTextRef.current?.focus();
                    setShowRoleNameMessage(true);
                    setTimeout(() => setShowRoleNameMessage(false), 3000);
                    return;
               }
               userStore.role = { id: formData.id, roleName: formData.roleName, roleDescription: formData.roleDescription } as Role;
               stepperRef.current?.nextCallback()
          }

          return (<div className="roles-stepper-container flex flex-column h-max">
               <div className="gap-2 p-3 flex-auto flex flex-column justify-content-start font-medium">
                    <div className='pb-2'><span className='text-3xl'>Overview</span></div>
                    <div><label>Name</label></div>
                    <div className="flex flex-row">
                         <div>
                              <InputText className='p-inputtext-sm' id="roleName" disabled={isEditing ? true : false} style={{ width: '250px' }} ref={inputTextRef} name="roleName" value={formData.roleName} onChange={handleChange} required />
                         </div>
                         <div id="RoleNameIsrequiredMessage" className={`${showRoleNameMessage ? '' : 'd-none'} pl-2`} ><Message severity="error" text="Role name is required" style={{ padding: '.5rem 1rem' }} /></div>
                    </div>
                    <div className="flex flex-column gap-2">
                         <label>Description</label>
                         <InputTextarea rows={6} cols={5} id="roleDescription" ref={textAreaRef} name="roleDescription" value={formData.roleDescription!} onChange={handleTextAreaChange} />
                    </div>
                    <div style={{ display: 'none' }}>
                         <Button id="btnValidateRole" label="boton oculto" onClick={() => validateRole()} />
                    </div>
                    <Dialog header="Error" style={{ width: '25%' }} visible={visibleRoleExistMessage} onHide={() => { if (!visibleRoleExistMessage) return; setVisibleRoleExistMessage(false); }}>
                         <div className='flex align-items-center gap-3'>
                              <div><i className='pi pi-question-circle' style={{ fontSize: '4rem', color: 'var( --red-400)' }}></i></div>
                              <div><p>Role name already exists</p></div>
                         </div>
                         <div className="flex flex-wrap justify-content-end pt-3"><Button iconPos='left' label="Aceptar" icon="pi pi-check" onClick={() => setVisibleRoleExistMessage(false)} /></div>
                    </Dialog>
               </div>
          </div>
          )
     }

     const PagesStep = () => {

          const [mainCheckboxState, setMainCheckboxState] = useState<Record<string, boolean>>({});
          const [checkboxState, setCheckboxState] = useState<Record<string, boolean>>({});
          const [permissionsByRole, setPermissionsByRole] = useState<PermissionsByRole[]>([]);

          useEffect(() => {
               if (userStore.permissionsByRole.length > 0)
                    setActionsListFromState(userStore.permissionsByRole)
          }, [])

          const setActionsListFromState = (permissionsByRole: PermissionsByRole[]) => {
               const updatedCheckboxState: Record<string, boolean> = {};
               const updatedMainCheckboxState: Record<string, boolean> = {};

               permissionsByRole.forEach(action => updatedCheckboxState[`${action.pageId}.${action.actionId}`] = true);

               setCheckboxState(updatedCheckboxState);
               setPermissionsByRole(permissionsByRole);
               counterByPage(permissionsByRole);

               counterActionsByPage.forEach(res => {
                    if (permissionsByRole.some(f => f.pageName === res.pageName) && res.counter === actionsData.length)
                         updatedMainCheckboxState[res.pageId] = true;
               });

               setMainCheckboxState(updatedMainCheckboxState);
          }

          const counterByPage = (permissionsByRole: PermissionsByRole[]) => {
               const pageCount: Record<string, number> = {};

               permissionsByRole.forEach(({ pageName, pageId }) => {
                    pageCount[pageName] = (pageCount[pageName] || 0) + 1;
                    const existingPage = counterActionsByPage.find(page => page.pageName === pageName);

                    if (existingPage)
                         existingPage.counter = pageCount[pageName];
                    else
                         counterActionsByPage.push({ pageName, counter: pageCount[pageName], pageId });
               });
          }

          const handleCheckboxChange = (currentPermissionsByRole: PermissionsByRole) => {
               setCheckboxState((prevState) => ({ ...prevState, [currentPermissionsByRole.id]: currentPermissionsByRole.checked }));

               let newPermissionsByRole = permissionsByRole.filter(f => f.id !== currentPermissionsByRole.id);

               if (currentPermissionsByRole.checked)
                    newPermissionsByRole.push(currentPermissionsByRole);
               else
                    setMainCheckboxState((prevState) => ({ ...prevState, [currentPermissionsByRole.pageId]: false }));

               setPermissionsByRole(newPermissionsByRole);
               userStore.permissionsByRole = newPermissionsByRole;
          }

          const selectAllActionsByPage = (isChecked: boolean, page: Page) => {
               const updatedPermissionsByRole = isChecked
                    ? [
                         ...permissionsByRole.filter(f => f.pageId !== page._id),
                         ...actionsData.map(action => ({
                              checked: true,
                              id: `${page._id}.${action._id}`,
                              pageName: page.pageName,
                              actionId: action._id,
                              actionName: action.actionName,
                              pageId: page._id,
                              roleId: userStore.role.id,
                              roleName: userStore.role.roleName
                         }))
                    ]
                    : permissionsByRole.filter(f => f.pageId !== page._id);

               setPermissionsByRole(updatedPermissionsByRole);
               setCheckboxState(prevState => {
                    const newState = { ...prevState };
                    actionsData.forEach(action => {
                         newState[`${page._id}.${action._id}`] = isChecked;
                    });
                    return newState;
               });
               userStore.permissionsByRole = updatedPermissionsByRole;
          }

          const accordionTabs = () => {
               return pagesData.length === 0
                    ?
                    <div>No hay datos</div>
                    :
                    pagesData.map((page, index) => (
                         <AccordionTab
                              key={index}
                              header={<span className="font-bold white-space-nowrap">{page.pageName}</span>}>
                              <div className="dt-accordion-tab flex flex-column w-full p-0 ">
                                   <div className='w-fulll flex justify-content-end' style={{ margin: '-1rem 0 1rem 0' }}>
                                        <span className='pr-2'>Select all</span>
                                        <InputSwitch
                                             checked={mainCheckboxState[`${page._id}`] || false}
                                             onChange={(e: InputSwitchChangeEvent) => {
                                                  setMainCheckboxState((prevState) => ({ ...prevState, [page._id]: e.value }));
                                                  selectAllActionsByPage(e.value, page)
                                             }}
                                        />
                                   </div>
                                   <div className="actions-container">
                                        {
                                             actionsData.map((action, index) => {
                                                  return (
                                                       <div key={index} className={`action-box action-box-${index}`}>
                                                            <InputSwitch
                                                                 id={`${page._id}.${action._id}`}
                                                                 checked={checkboxState[`${page._id}.${action._id}`] || false} // Default to false if not initialized
                                                                 onChange={(e) => handleCheckboxChange(
                                                                      {
                                                                           checked: e.value,
                                                                           id: `${page._id}.${action._id}`,
                                                                           pageName: page.pageName,
                                                                           actionId: action._id,
                                                                           actionName: action.actionName,
                                                                           pageId: page._id,
                                                                           roleId: userStore.role.id,
                                                                           roleName: userStore.role.roleName
                                                                      }
                                                                 )}
                                                            />
                                                            <label>{action.actionName}</label>
                                                       </div>
                                                  )
                                             })
                                        }
                                   </div>
                              </div>
                         </AccordionTab>
                    ));
          }

          return (
               <Accordion multiple key={1000} activeIndex={[0]} className='page-accordion-header'>
                    {accordionTabs()}
               </Accordion>
          )
     }

     const UsersStep = () => {

          const [source, setSource] = useState<UserData[]>([]);
          const [target, setTarget] = useState<UserData[]>([]);

          useEffect(() => {

               const sourseUserData = userList.filter(user => userStore.usersByRole.some(stateUser => stateUser.email === user.email));
               const targetUserData = userList.filter(user => !userStore.usersByRole.some(stateUser => stateUser.email === user.email));

               setSource(targetUserData);
               setTarget(sourseUserData);

               if (userStore.permissionsByRole.length === 0) {
                    let picklistButtons = document.getElementsByClassName('p-picklist-buttons') as unknown as HTMLElement[]
                    picklistButtons[0].classList.add('v-hidden')

                    let picklistWrapper = document.getElementsByClassName('p-picklist-target-wrapper') as unknown as HTMLElement[]
                    for (const pick of picklistWrapper) {
                         pick.classList.add('p-disabled');
                    }
                    userStore.usersByRole = [];
               }

          }, [userList, userStore.usersByRole]);

          const onChange = (event: PickListChangeEvent) => {
               setSource(event.source);
               setTarget(event.target);
               userStore.usersByRole = event.target as UserData[];
          };

          const itemTemplate = (item: UserData) => {
               return (
                    <div className="flex flex-wrap p-2 align-items-center gap-3">
                         <img className="w-3rem shadow-2 flex-shrink-0 border-round" src={item.imageProfilePath} alt={item.email} />
                         <div className="flex-1 flex flex-column gap-2">
                              <span className="font-bold">{`${item.firstName} ${item.lastName}`}</span>
                              <div className="flex align-items-center gap-2"><span>{item.email}</span></div>
                         </div>
                    </div>
               );
          };

          return (
               <PickList
                    dataKey="_id"
                    className="p-3"
                    source={source}
                    target={target}
                    onChange={onChange}
                    itemTemplate={itemTemplate}
                    sourceHeader="Availables"
                    targetHeader="Selected"
                    sourceStyle={{ height: '24rem' }}
                    targetStyle={{ height: '24rem' }}
                    showSourceControls={false}
                    showTargetControls={false}
                    showTargetFilter={false}
                    showSourceFilter={false}
               />
          )
     }

     const ReviewStep = () => {
          const groupedByPage = () => {
               return Object.entries(
                    userStore.permissionsByRole.reduce((acc: Record<string, { pageName: string, actionName: string }[]>, { pageName, actionName }) => {
                         if (!acc[pageName])
                              acc[pageName] = [];

                         acc[pageName].push({ pageName, actionName });
                         return acc;
                    }, {})
               ).map(([page, actions]) => ({ page, actions }));
          }

          const usersByRoleListTemplate = (item: UsersByRole) => {
               return (
                    <div className="flex flex-wrap p-2 align-items-center gap-3">
                         <img className="w-3rem shadow-2 flex-shrink-0 border-round" src={item.imageProfilePath ?? DEFAULT_USER_IMAGE} alt={item.email} />
                         <div className="flex-1 flex flex-column gap-2">
                              <span className="font-bold">{`${item.firstName} ${item.lastName}`}</span>
                              <div className="flex align-items-center gap-2"><span>{item.email}</span></div>
                         </div>
                         <Divider className='m-0' />
                    </div>
               );
          };

          return (
               <TabView className='pt-3'>
                    <TabPanel leftIcon="pi pi-lock mr-2" header="Role specifications" className='flex flex-column gap-3'>
                         <div className='pt-2 flex flex-column gap-3'>
                              <div><span><strong>Name:</strong></span></div>
                              <div className='pl-3'><span className='text-2xl' >{userStore.role.roleName}</span></div>
                         </div>
                         <div className='pt-2 flex flex-column gap-3'>
                              <div><span><strong>Description:</strong></span></div>
                              <div className='pl-3'><span className='text-2xl' >{userStore.role.roleDescription || 'No specified'}</span></div>
                         </div>
                    </TabPanel>
                    <TabPanel leftIcon="pi pi-shield mr-2" header="Permissions by this role">
                         {
                              groupedByPage().length === 0 ?
                                   <div key={0} className='w-full'>
                                        <div>No existen páginas seleccionadas</div>
                                   </div>
                                   :
                                   groupedByPage().map((page, index) => {
                                        return (
                                             <div key={index} className='permissions-by-role-container'>
                                                  <div className='review-pages-list'>
                                                       <div className='review-page'>{page.page}</div>
                                                       <div className='rewiew-actions-list'>
                                                            {page.actions.map((a, actionIndex) => (<span key={actionIndex}>{a.actionName}</span>))}
                                                       </div>
                                                  </div>
                                             </div>
                                        )
                                   })
                         }
                    </TabPanel>
                    <TabPanel leftIcon="pi pi-users mr-2" header="Users assigned to this role">
                         {
                              userStore.usersByRole.length === 0
                                   ?
                                   <div key={0} className='w-full'>
                                        <div>No existen usuarios seleccionadas</div>
                                   </div>
                                   :
                                   userStore.usersByRole.map((user, index) => (<div key={index}>{usersByRoleListTemplate(user)}</div>))}
                    </TabPanel>
               </TabView>
          )
     }

     const nextCallback = () => {
          let btn = document.getElementById('btnValidateRole') as HTMLButtonElement
          btn.click();
     }

     const PermissionsTab = () => {
          const [stepperDialogVisible, setStepperDialogVisible] = useState<boolean>(false)
          const [editStepperDialogVisible, setEditStepperDialogVisible] = useState<boolean>(false)
          const [dtPermissionsByRoleData, setDtPermissionsByRoledata] = useState<PermissionsByRoleData[]>([])
          const [roleSelected, setRoleSelected] = useState<Role>({} as Role)
          const [showDeleteRoleModal, setShowDeleteRoleModal] = useState(false)

          useEffect(() => {
               getPermissionsByRoleData();
          }, [])

          const getPermissionsByRoleData = () => {
               const permissionsProfileStateList = getPermissionsProfileStateList();
               const permissionsByRoleDataList: PermissionsByRoleData[] = permissionsProfileStateList.map(permission => ({
                    role: permission.role,
                    permissionsByRole: permission.permissionsByRole,
                    counterPages: 0,
                    usersByRole: permission.usersByRole,
                    counterUsers: permission.usersByRole.length
               })).sort((a, b) => a.usersByRole.length - b.usersByRole.length);

               permissionsProfileStateList.forEach(permission => {
                    const groupedData = groupBy(permission.permissionsByRole, "pageName");

                    Object.entries(groupedData).forEach(([, values]) => {
                         const roleName = (values as PermissionsByRole[])[0].roleName!;
                         const foundValue = permissionsByRoleDataList.find(f => f.role.roleName === roleName);
                         if (foundValue)
                              foundValue.counterPages += 1;
                    });
               });
               setDtPermissionsByRoledata(permissionsByRoleDataList);
          };

          const RoleDatatable = () => {

               const [filters, setFilters] = useState<DataTableFilterMeta>({
                    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
                    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
                    'email': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
                    representative: { value: null, matchMode: FilterMatchMode.IN },
                    status: { value: null, matchMode: FilterMatchMode.EQUALS },
                    verified: { value: null, matchMode: FilterMatchMode.EQUALS }
               });

               const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

               const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                    e.preventDefault();
                    const value = e.target.value;
                    let _filters = { ...filters };
                    // @ts-ignore
                    _filters['global'].value = value;
                    setFilters(_filters);
                    setGlobalFilterValue(value);
               };

               const rolesOptionsBodyTemplate = (permisions: PermissionsByRoleData) => {
                    return (
                         <div className="flex justify-content-end gap-2">
                              {
                                   permissionsByRole.length > 0 && hasAction(ACTIONS.EDIT) &&
                                   <i className="pi pi-pencil" style={{ fontSize: '1.2rem', cursor: 'pointer' }} onClick={() => {
                                        setRoleSelected(permisions.role)
                                        setEditStepperDialogVisible(true)
                                   }}></i>
                              }
                              {permissionsByRole.length > 0 && permisions.role.roleName !== "Administrator" && hasAction(ACTIONS.DELETE) && <i className="pi pi-trash" onClick={() => {
                                   setRoleSelected(permisions.role)
                                   setShowDeleteRoleModal(true)
                              }} style={{ fontSize: '1.2rem', cursor: 'pointer' }} ></i>}
                         </div>
                    );
               }

               const newRole = () => {
                    userStore.role = {} as Role;
                    userStore.permissionsByRole = [];
                    userStore.usersByRole = [];
                    setStepperDialogVisible(true)
               }

               const rolesRenderHeader = () => {
                    return (
                         <div className="flex justify-content-between pt2">
                              <div>
                                   <IconField iconPosition="left">
                                        <InputIcon className="pi pi-search" />
                                        <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar" className="p-inputtext-sm" />
                                   </IconField>
                              </div>
                              <div><Button icon={"pi pi-plus"} label="Nuevo rol" className="w-8rem" onClick={newRole}></Button></div>
                         </div>
                    );
               };

               const acceptDeleteRole = async () => {
                    try {

                         const controller = new RoleController(userLoggedData!);
                         const result = await controller.DeleteRole(roleSelected) as unknown as ApiResultResponse
                         if (!result.hasError) {
                              toast.current?.show({ severity: 'success', summary: 'Confirmed', detail: result.message, life: 3000 });
                              let permissionsProfileStateListTmp = getPermissionsProfileStateList().filter(f => f.role.roleName !== roleSelected.roleName);
                              updatePermissionsProfile([...permissionsProfileStateListTmp]);
                              getPermissionsByRoleData();
                         }
                         else {
                              const err = new Error(result.message);
                              alertModal(err);
                         }

                    } catch (err) {
                         console.log('error: ', err)
                         const error = err as unknown as AxiosError
                         const errorMessage = (error?.response?.data as any).error
                         if (errorMessage === 'Invalid Bearer token')
                              alertModal();
                    }
               }

               return (
                    <>
                         <DataTable
                              className='dt-roles' value={dtPermissionsByRoleData} header={rolesRenderHeader} filters={filters} onFilter={(e) => setFilters(e.filters)} emptyMessage="No users found."
                              sortField="role.roleName" sortOrder={1} dataKey="role.roleName" loading={loading} tableStyle={{ minWidth: '50rem' }}
                         >
                              <Column field="role.roleName" header="Role" sortable />
                              <Column field="counterPages" header="Pages" sortable />
                              <Column field="counterUsers" header="Users" sortable />
                              <Column field="role.createdAt" header="Creado" sortable />
                              <Column field="role.updatedAt" header="Actualizado" sortable />
                              <Column headerStyle={{ width: '5rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={rolesOptionsBodyTemplate} />
                         </DataTable>
                         <ConfirmDialog
                              id="ConfirmDialogDelete"
                              group="declarative"
                              visible={showDeleteRoleModal}
                              onHide={() => setShowDeleteRoleModal(false)}
                              message={`Are you sure you want to proceed to delete the "${roleSelected.roleName}" role?`}
                              header="Confirmation"
                              icon="pi pi-exclamation-triangle"
                              acceptLabel="Eliminar"
                              rejectLabel="Cancelar"
                              acceptClassName="p-button p-component p-button-raised p-button-danger"
                              rejectClassName="p-button p-component p-button-outlined p-button-danger"
                              accept={acceptDeleteRole}
                         />
                    </>
               )
          }

          const RoleStepper = ({ isEditing, role }: RolesStpperProps) => {

               useEffect(() => {
                    if (role?.roleName && isEditing) {
                         const permission = dtPermissionsByRoleData.find(p => p.role.roleName === role?.roleName);
                         if (permission) {
                              userStore.role = permission.role
                              userStore.permissionsByRole = permission.permissionsByRole
                              userStore.usersByRole = permission.usersByRole
                         }
                    }
                    else {
                         const datos = document.getElementById('roleName')
                         console.log('datos: ', datos);
                    }
               }, [])

               const savePermissions = async (isEditing: boolean) => {
                    try {

                         const controller = new PermissionController(userLoggedData!);
                         if (!isEditing)
                              userStore.role.id = "67a3566daec1565315b5a9c2"

                         const result = isEditing ? await controller.Update(userStore) as unknown as ApiResultResponse : await controller.Save(userStore) as unknown as ApiResultResponse

                         const permissionsProfileStateList = getPermissionsProfileStateList();
                         let permissionsProfileStateListTmp: PermissionsProfile[] = [];

                         if (!result.hasError) {
                              if (isEditing) { //EDIT
                                   for (const perms of permissionsProfileStateList) {
                                        if (perms.role.roleName === userStore.role.roleName) {
                                             perms.role = userStore.role
                                             perms.permissionsByRole = userStore.permissionsByRole
                                             perms.usersByRole = userStore.usersByRole
                                        }
                                        permissionsProfileStateListTmp.push(perms)
                                   }
                              }
                              else {
                                   const data = result.data as unknown as PermissionsProfile
                                   userStore.role = data.role
                                   permissionsProfileStateListTmp = [...permissionsProfileStateList, userStore]
                              }

                              updatePermissionsProfile([...permissionsProfileStateListTmp]);
                              getPermissionsByRoleData();

                              isEditing ? setEditStepperDialogVisible(false) : setStepperDialogVisible(false);
                              toast.current?.show({ severity: 'success', summary: isEditing ? 'Updated' : 'Saved', detail: result.message, life: 3000 });
                         }
                         else {
                              const err = new Error(result.message);
                              alertModal(err);
                         }

                    } catch (err) {
                         console.log('error: ', err)
                         const error = err as unknown as AxiosError
                         alertModal((error?.response?.data as any).error);
                    }
               }

               const saveRole = async () => {

                    try {
                         const roleNameInputText = document.getElementById('roleName') as HTMLInputElement;
                         const roleDescriptionInputText = document.getElementById('roleDescription') as HTMLInputElement;

                         if (!roleNameInputText.value) {
                              const errorMessage = document.getElementById('RoleNameIsrequiredMessage') as HTMLDivElement;
                              errorMessage.classList.remove('d-none');
                              setTimeout(() => errorMessage.classList.add('d-none'), 3000);
                              return;
                         }

                         const controller = new RoleController(userLoggedData!);
                         const result = await controller.AddRole({ id: "67a3566daec1565315b5a9c2", roleName: roleNameInputText.value, roleDescription: roleDescriptionInputText.value }) as unknown as ApiResultResponse;

                         if (result.hasError) {
                              alertModal(new Error(result.message));
                              return;
                         }

                         toast.current?.show({ severity: 'success', summary: 'Saved', detail: result.message, life: 3000 });
                         const permissionsProfileList = getPermissionsProfileStateList()

                         let newPermissionProfile: PermissionsProfile = {
                              role: result.data as Role,
                              permissionsByRole: [],
                              usersByRole: []
                         }

                         updatePermissionsProfile([...permissionsProfileList, newPermissionProfile]);
                         getPermissionsByRoleData();
                         setStepperDialogVisible(false);

                    } catch (err) {
                         console.log('error: ', err)
                         const error = err as unknown as AxiosError
                         alertModal((error?.response?.data as any).error);
                    }

               }

               const updateRole = async () => {

                    try {
                         const roleDescriptionInputText = document.getElementById('roleDescription') as HTMLInputElement;
                         roleSelected.roleDescription = roleDescriptionInputText.value;
                         const controller = new RoleController(userLoggedData!);
                         const result = await controller.UpdateRole(roleSelected) as unknown as ApiResultResponse;

                         if (result.hasError) {
                              alertModal(new Error(result.message));
                              return;
                         }

                         toast.current?.show({ severity: 'success', summary: 'Updated', detail: result.message, life: 3000 });
                         const updatedRole = result.data as Role;
                         const updatedPermissionsProfile = getPermissionsProfileStateList().map(perms => {
                              if (perms.role.roleName === updatedRole.roleName) {
                                   return { ...perms, role: updatedRole, permissionsByRole: userStore.permissionsByRole, usersByRole: userStore.usersByRole };
                              }
                              return perms;
                         });

                         updatePermissionsProfile(updatedPermissionsProfile);
                         getPermissionsByRoleData();
                         setEditStepperDialogVisible(false);

                    } catch (err) {
                         console.log('error: ', err)
                         const error = err as unknown as AxiosError
                         alertModal((error?.response?.data as any).error);
                    }

               }

               return (
                    <>
                         <Stepper ref={stepperRef} linear={true} activeStep={0}>
                              <StepperPanel header="Overview" >
                                   <div className='stepper-content'>
                                        <RoleStep isEditing={isEditing} />
                                   </div>
                                   <Divider />
                                   <div className="flex pt-4 justify-content-end gap-2">
                                        <Button label="Cancel" outlined severity="secondary" icon="pi pi-times" onClick={() => {
                                             isEditing ? setEditStepperDialogVisible(false) : setStepperDialogVisible(false)
                                        }} />
                                        {
                                             isEditing
                                                  ?
                                                  <Button label="Update" icon="pi pi-refresh" iconPos="left" onClick={updateRole} />
                                                  :
                                                  <Button label="Save" icon="pi pi-save" iconPos="left" onClick={saveRole} />
                                        }
                                        <Button label="Siguiente" outlined icon="pi pi-arrow-right" iconPos="right" onClick={() => nextCallback()} />
                                   </div>
                              </StepperPanel>
                              <StepperPanel header="Permissions by role">
                                   <div className='stepper-content'>
                                        <div className="roles-stepper-container flex flex-column ">
                                             <PagesStep />
                                        </div>
                                   </div>
                                   <Divider />
                                   <div className="flex pt-4 justify-content-end gap-2">
                                        <Button label="Atras" outlined severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current?.prevCallback()} />
                                        <Button label="Siguiente" outlined icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current?.nextCallback()} />
                                   </div>
                              </StepperPanel>
                              <StepperPanel header="Users">
                                   <div className='stepper-content'>
                                        <div className="roles-stepper-container">
                                             <UsersStep />
                                        </div>
                                   </div>
                                   <Divider />
                                   <div className="flex pt-4 justify-content-end gap-2">
                                        <Button label="Atras" outlined severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current?.prevCallback()} />
                                        <Button label="Siguiente" outlined icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current?.nextCallback()} />
                                   </div>
                              </StepperPanel>
                              <StepperPanel header="Review">
                                   <div className='stepper-content'>
                                        <div className="roles-stepper-container">
                                             <ReviewStep />
                                        </div>
                                   </div>
                                   <Divider />
                                   <div className="flex pt-4 justify-content-end gap-2">
                                        <Button label="Atras" outlined severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current?.prevCallback()} />
                                        <Button label="Finish" outlined icon="pi pi-times" onClick={() => savePermissions(isEditing)} />
                                   </div>
                              </StepperPanel>
                         </Stepper>
                    </>
               )
          }

          const onTabChange = (e: TabViewTabChangeEvent) => {
               setTabActiveIndex(e.index);
               if (e.index === 1)
                    loadPagesData();
          }

          return (
               <>
                    <TabView className='roles-tab-view' activeIndex={tabActiveIndex} onTabChange={onTabChange}>
                         <TabPanel header="Users" leftIcon="pi pi-users mr-2">
                              <UsersDataTable />
                         </TabPanel>
                         <TabPanel header="Roles" rightIcon="pi pi-lock ml-2">
                              <RoleDatatable />
                         </TabPanel>
                         <TabPanel header="Pages" leftIcon="pi pi-clone mr-2">
                              <PagesDataTable />
                         </TabPanel>
                    </TabView>
                    <Dialog header="New role" visible={stepperDialogVisible} onHide={() => setStepperDialogVisible(false)} style={{ width: '75vw', height: '90vh' }} modal maximizable resizable={false} contentStyle={{ height: '300px' }} >
                         <RoleStepper isEditing={false} role={roleSelected} />
                    </Dialog>
                    <Dialog header="Edit role" visible={editStepperDialogVisible} onHide={() => setEditStepperDialogVisible(false)} style={{ width: '75vw', height: '90vh' }} modal maximizable resizable={false} contentStyle={{ height: '300px' }} >
                         <RoleStepper isEditing={true} role={roleSelected} />
                    </Dialog>
               </>
          )
     }

     return (
          <>
               {permissionsByRole.length > 0 && hasAction(ACTIONS.LIST) &&
                    (
                         <>
                              <div className='w-full my-2 px-2 pb-2 flex justify-content-between align-items-center'>
                                   <span className='text-2xl'>Permisos</span>
                                   {/* <Button icon="pi pi-external-link" rounded text onClick={() => setDialogVisible(true)} /> */}
                              </div>
                              <PermissionsTab />
                         </>
                    )}
               <ConfirmDialog
                    group="alert"
                    visible={showAlertModal}
                    onHide={() => setShowAlertModal(false)}
                    icon="pi pi-exclamation-triangle"
                    acceptLabel="Aceptar"
                    acceptClassName="p-button p-component p-button-raised p-button-danger"
                    rejectClassName="d-none"
               />
               <Toast ref={toast} />
          </>
     )
}

export default IndexRoles