import { AxiosError } from 'axios';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Divider } from 'primereact/divider';
import { InputSwitch, InputSwitchChangeEvent } from 'primereact/inputswitch';
import { InputTextarea } from 'primereact/inputtextarea';
import { Message } from 'primereact/message';
import { PickList, PickListChangeEvent } from 'primereact/picklist';
import { Stepper, StepperRefAttributes } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { TabPanel, TabView } from 'primereact/tabview';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button, confirmDialog, ConfirmDialog, Dialog, InputText } from '../../components/primereact/index';
import { ACTIONS } from '../../config/constants.d';
import { PermissionsByRoleProvider, usePermissionsByRoleContext } from '../../context/PermissionsByRoleContext';
import { ActionsController, ResoursesController, RolesController, UserController } from '../../controllers';
import { useAuth } from "../../hooks";
import { Actions, ActionsSelected, ApiResultResponse, NewRole, PermissionsByRole, Resourses, Roles, UserData } from '../../types';
import RolesDatatable from './components/RolesDatatable';
import UsersDataTable from './components/UsersDataTable';
import './index.css';

const IndexRoles = () => {
     //..:: [ VARIABLES ] ::..
     //const { t } = useTranslation();

     //..:: [ HOOKS ] ::..
     //WARNING: ..:: [ Las siguientes lineas son obligatiorias para ejecutar los permisos ]::..
     //const navigate = useNavigate();
     const { getToken, logout, hasAction, getPermissionList, isAllowed } = useAuth();
     const [userList, setUserList] = useState<UserData[]>([])
     const [visibleRight, setVisibleRight] = useState<boolean>(false);
     const [stepperDialogVisible, setStepperDialogVisible] = useState<boolean>(false)


     const [rolesData, setRolesData] = useState([] as Roles[])
     const [resoursesData, setResoursesData] = useState([] as Resourses[])
     const [actionsData, setActionsData] = useState([] as Actions[])
     const [permissionsByRole, setPermissionsByRole] = useState([] as PermissionsByRole[])
     const [loading, setLoading] = useState<boolean>(true);

     const [tabActiveIndex, setTabActiveIndex] = useState<number>(0);

     //..::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..

     useEffect(() => {
          getData()
     }, [])

     //resourse tab

     //..:: [ FUNCTIONS ] ::..

     const getData = async () => {
          if (!isAllowed(window.location.pathname.replace("/", ""))) {
               <Navigate to='/errors/403' />
          }

          setLoading(true)
          await loadUsersData();
          await loadRolesData();
          await loadResoursesData();
          await loadActionsData();

          const permissionsByRole = getPermissionList(window.location.pathname.replace("/", ""))
          setPermissionsByRole(permissionsByRole as PermissionsByRole[])
          setLoading(false)
     }

     const loadUsersData = async () => {
          try {
               const controller = new UserController(getToken())
               const data = await controller.GetUsers();
               setUserList(data as unknown as UserData[])

          } catch (err) {
               console.log('error: ', err)
               const error = err as unknown as AxiosError
               const errorMessage = (error?.response?.data as any).error
               if (errorMessage === 'Invalid Bearer token') {
                    alertModal();
               }
          }
     }

     const loadRolesData = async () => {
          try {
               const controller = new RolesController(getToken())
               const data = await controller.GetRoles() as unknown as ApiResultResponse;
               const list: Roles[] = data?.data as unknown as Roles[]
               setRolesData(list)

          } catch (err) {
               console.log('error: ', err)
               const error = err as unknown as AxiosError
               const errorMessage = (error?.response?.data as any).error
               if (errorMessage === 'Invalid Bearer token') {
                    alertModal();
               }
          }
     }

     const loadResoursesData = async () => {
          try {
               const controller = new ResoursesController(getToken())
               const data = await controller.GetResourse() as unknown as ApiResultResponse;
               const list: Resourses[] = data?.data as unknown as Resourses[]
               setResoursesData(list)


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
               const controller = new ActionsController(getToken())
               const data = await controller.GetActions() as unknown as ApiResultResponse;
               const list: Actions[] = data?.data as unknown as Actions[]
               setActionsData(list)

          } catch (err) {
               console.log('error: ', err)
               const error = err as unknown as AxiosError
               const errorMessage = (error?.response?.data as any).error
               if (errorMessage === 'Invalid Bearer token') {
                    alertModal();
               }
          }
     }

     const alertModal = () => {
          confirmDialog({
               group: 'alert',
               message: 'La session ha caducado, debe iniciar sesión nuevamente.',
               header: 'iniciar sesión',
               icon: 'pi pi-exclamation-triangle',
               defaultFocus: 'accept'
          });
     };

     const redirect = () => {
          logout();
     }

     const UsersPickList = () => {
          const [source, setSource] = useState<UserData[]>([]);
          const [target, setTarget] = useState<UserData[]>([]);

          useEffect(() => {
               setSource(userList)
          }, [])

          const onChange = (event: PickListChangeEvent) => {
               setSource(event.source);
               setTarget(event.target);
          };

          const itemTemplate = (item: UserData) => {
               return (
                    <div className="flex flex-wrap p-2 align-items-center gap-3">
                         <img className="w-4rem shadow-2 flex-shrink-0 border-round" src={"https://primefaces.org/cdn/primereact/images/product/bamboo-watch.jpg"} alt={item.email} />
                         <div className="flex-1 flex flex-column gap-2">
                              <span className="font-bold">{item.email}</span>
                              <div className="flex align-items-center gap-2">
                                   <i className="pi pi-tag text-sm"></i>
                                   <span>{item.email}</span>
                              </div>
                         </div>
                    </div>
               );
          };

          return (
               <PickList dataKey="_id" className="p-3" source={source} target={target} onChange={onChange} itemTemplate={itemTemplate}
                    sourceHeader="Available" targetHeader="Selected" sourceStyle={{ height: '24rem' }} targetStyle={{ height: '24rem' }} />
          )
     }

     const contentMessage = (
          <div className="flex align-items-center">
               <div className="ml-2">PermissionsByRole take effect near real time.</div>
          </div>
     );

     const stepperRef = useRef<StepperRefAttributes>(null);

     const NewRoleContent = () => {
          const { dispatch } = usePermissionsByRoleContext();
          const inputTextRef = useRef<HTMLInputElement | null>(null);
          const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
          const [showRoleNameMessage, setShowRoleNameMessage] = useState(false)
          const [formData, setFormData] = useState<NewRole>({} as NewRole);
          const [visible, setVisible] = useState<boolean>(false);

          const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
               setFormData({
                    ...formData,
                    [event.target.id]: event.target.value,
               });
          };

          const handleTextAreaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
               setFormData({
                    ...formData,
                    [event.target.id]: event.target.value,
               });
          };

          const validateRole = () => {
               if (rolesData.find(f => f.roleName === formData.roleName)) {
                    setVisible(true);
                    return;
               }
               else if (!formData.roleName) {
                    inputTextRef.current?.focus();
                    setShowRoleNameMessage(true);
                    setTimeout(() => {
                         setShowRoleNameMessage(false);
                    }, 3000);
                    return;
               }
               dispatch({ type: 'ADD_ROLE', payload: { roleName: formData.roleName, roleDescription: formData.roleDescription } });
               stepperRef.current?.nextCallback()
          }

          return (<div className="roles-stepper-container flex flex-column h-max">
               <div className="gap-2 p-3 flex-auto flex flex-column justify-content-start font-medium">
                    <div className='pb-2'>
                         <span className='text-3xl'>Overview</span>
                    </div>
                    <div>
                         <label>Name</label>
                    </div>
                    <div className="flex flex-row">
                         <div>
                              <InputText
                                   className='p-inputtext-sm'
                                   id="roleName"
                                   style={{ width: '250px' }}
                                   ref={inputTextRef}
                                   name="roleName"
                                   value={formData.roleName}
                                   onChange={handleChange}
                                   required
                              />
                         </div>
                         {showRoleNameMessage &&
                              <div className='pl-2'>
                                   <Message severity="error" text="Role name is required" style={{ padding: '.5rem 1rem' }} />
                              </div>
                         }
                    </div>
                    <div className="flex flex-column gap-2">
                         <label>Description</label>
                         <InputTextarea
                              rows={26}
                              cols={5}
                              id="roleDescription"
                              ref={textAreaRef}
                              name="roleDescription"
                              value={formData.roleDescription}
                              onChange={handleTextAreaChange}
                         />
                    </div>
                    <div style={{ display: 'none' }}>
                         <Button id="btnValidateRole" label="boton oculto" onClick={() => validateRole()} />
                    </div>
                    <Dialog header="Error" style={{ width: '25%' }} visible={visible} onHide={() => { if (!visible) return; setVisible(false); }}>
                         <div className='flex align-items-center gap-3'>
                              <div>
                                   <i className='pi pi-question-circle' style={{ fontSize: '4rem', color: 'var( --red-400)' }}></i>
                              </div>
                              <div>
                                   <p className="">
                                        Role name already exists
                                   </p>
                              </div>
                         </div>
                         <div className="flex flex-wrap justify-content-end pt-3">
                              <Button iconPos='left' label="Aceptar" icon="pi pi-check" onClick={() => setVisible(false)} />
                         </div>
                    </Dialog>
               </div>
          </div>
          )
     }

     const ResoursesAccordion = () => {
          const { state, dispatch } = usePermissionsByRoleContext();
          const [mainCheckboxState, setMainCheckboxState] = useState<Record<string, boolean>>({});
          const [checkboxState, setCheckboxState] = useState<Record<string, boolean>>({});
          const [actionsSelected, setActionsSelected] = useState<ActionsSelected[]>([]);

          const handleCheckboxChange = (currentActionSelected: ActionsSelected) => {
               setCheckboxState((prevState) => ({
                    ...prevState,
                    [currentActionSelected.id]: currentActionSelected.checked
               }));

               let newActionsSelected = [...actionsSelected]
               if (newActionsSelected.length === 0) {
                    newActionsSelected.push({
                         checked: currentActionSelected.checked,
                         id: currentActionSelected.id,
                         resourseName: currentActionSelected.resourseName,
                         actionId: currentActionSelected.actionId,
                         actionName: currentActionSelected.actionName,
                         resourseId: currentActionSelected.resourseId,
                         roleId: currentActionSelected.roleId,
                         roleName: currentActionSelected.roleName
                    });
                    setActionsSelected(newActionsSelected);
               }
               else {
                    let actionFound = newActionsSelected.find(f => f.id === currentActionSelected.id)
                    if (actionFound && !currentActionSelected.checked) {
                         newActionsSelected = newActionsSelected.filter(f => f.id !== currentActionSelected.id);
                         setActionsSelected(newActionsSelected);
                         setMainCheckboxState((prevState) => ({
                              ...prevState,
                              [currentActionSelected.resourseId]: false
                         }));
                    }
                    else {
                         newActionsSelected.push({
                              checked: currentActionSelected.checked,
                              id: currentActionSelected.id,
                              resourseName: currentActionSelected.resourseName,
                              actionId: currentActionSelected.actionId,
                              actionName: currentActionSelected.actionName,
                              resourseId: currentActionSelected.resourseId,
                              roleId: currentActionSelected.roleId,
                              roleName: currentActionSelected.roleName
                         });
                         setActionsSelected(newActionsSelected);
                    }
               }
               //console.clear();
               //console.table(newActionsSelected)
               dispatch({ type: "CLEAR_ACTIONS_SELECTED" });
               dispatch({ type: "SET_ACTIONS_SELECTED", payload: newActionsSelected });
               console.log('state: ', state)
          };

          const selectAllActionsByResourse = (isChecked: boolean, resourse: Resourses) => {
               let newActionsSelected = [...actionsSelected]
               if (isChecked) {
                    newActionsSelected = newActionsSelected.filter(f => f.resourseId !== resourse._id);
                    actionsData.map((action) => {
                         newActionsSelected.push({
                              checked: true,
                              id: `${resourse._id}.${action._id}`,
                              resourseName: resourse.resourseName,
                              actionId: action._id,
                              actionName: action.actionName,
                              resourseId: resourse._id,
                              roleId: null,
                              roleName: null//roleName
                         })
                         setActionsSelected(newActionsSelected);
                         let currentActionSelected: ActionsSelected = {
                              checked: true,
                              id: `${resourse._id}.${action._id}`,
                              resourseName: resourse.resourseName,
                              actionId: action._id,
                              actionName: action.actionName,
                              resourseId: resourse._id,
                              roleId: null,
                              roleName: null//roleName
                         }
                         setCheckboxState((prevState) => ({
                              ...prevState,
                              [currentActionSelected.id]: isChecked
                         }));
                    })
               }
               else {
                    newActionsSelected = [];
                    actionsData.map((action) => {
                         let currentActionSelected: ActionsSelected = {
                              checked: true,
                              id: `${resourse._id}.${action._id}`,
                              resourseName: resourse.resourseName,
                              actionId: action._id,
                              actionName: action.actionName,
                              resourseId: resourse._id,
                              roleId: null,
                              roleName: null//roleName
                         }
                         setCheckboxState((prevState) => ({
                              ...prevState,
                              [currentActionSelected.id]: false
                         }));
                    })
                    newActionsSelected = actionsSelected.filter(f => f.resourseId !== resourse._id)
                    setActionsSelected(newActionsSelected);
               }

               //console.clear();
               //console.table(newActionsSelected);
               dispatch({ type: "CLEAR_ACTIONS_SELECTED" });
               dispatch({ type: "SET_ACTIONS_SELECTED", payload: newActionsSelected });
               console.log('state: ', state)
          }

          const accordionTabs = () => {
               return resoursesData.map((resourse, index) => (
                    <AccordionTab
                         key={index}
                         header={<span className="font-bold white-space-nowrap">{resourse.resourseName}</span>}>
                         <div className="dt-accordion-tab flex flex-column w-full p-0 ">
                              <div className='w-fulll flex justify-content-end' style={{ margin: '-1rem 0 1rem 0' }}>
                                   <span className='pr-2'>Select all</span>
                                   <InputSwitch
                                        checked={mainCheckboxState[`${resourse._id}`] || false}
                                        onChange={(e: InputSwitchChangeEvent) => {
                                             setMainCheckboxState((prevState) => ({
                                                  ...prevState,
                                                  [resourse._id]: e.value
                                             }));
                                             selectAllActionsByResourse(e.value, resourse)
                                        }}
                                   />
                              </div>
                              <div className="actions-container">
                                   {
                                        actionsData.map((action, index) => {
                                             return (

                                                  <div key={index} className={`action-box action-box-${index}`}>
                                                       <InputSwitch
                                                            id={`${resourse._id}.${action._id}`}
                                                            checked={checkboxState[`${resourse._id}.${action._id}`] || false} // Default to false if not initialized
                                                            onChange={(e) => handleCheckboxChange(
                                                                 {
                                                                      checked: e.value,
                                                                      id: `${resourse._id}.${action._id}`,
                                                                      resourseName: resourse.resourseName,
                                                                      actionId: action._id,
                                                                      actionName: action.actionName,
                                                                      resourseId: resourse._id,
                                                                      roleId: null,
                                                                      roleName: null
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
               <Accordion multiple key={1000} activeIndex={[0]} className='pt-3 resourse-accordion-header'>
                    {accordionTabs()}
               </Accordion>
          )
     }

     const Review = () => {
          const { state } = usePermissionsByRoleContext();

          return (
               <div style={{ height: '42rem' }}>
                    <div className="flex gap-2">
                         <div><span>Role:</span></div>
                         <div><span>{state.newRole.roleName}</span></div>
                    </div>
                    <div className="flex gap-2">
                         <div><span>Role Description:</span></div>
                         <div><span>{state.newRole.roleDescription}</span></div>
                    </div>
                    <Divider />
                    <div className="">
                         {state.actionListSelected &&
                              state.actionListSelected.length > 0 &&
                              state.actionListSelected.map((action, index) => {
                                   return (
                                        <div key={action.id || index}>
                                             <div>{action.actionId}</div>
                                             <div>{action.actionName}</div>
                                        </div>
                                   );
                              })}
                         {state.actionListSelected && state.actionListSelected.length === 0 && (
                              <div>No actions selected.</div>
                         )}
                    </div>
               </div>
          )
     }

     const nextCallback = () => {
          let btn = document.getElementById('btnValidateRole') as HTMLButtonElement
          btn.click();
     }

     //Stepper / Wizard
     const RolesStepper = () => {
          return (
               <PermissionsByRoleProvider>
                    <Stepper ref={stepperRef} linear={true} activeStep={0}>
                         <StepperPanel header="Overview" >
                              <div style={{ overflow: 'auto', height: '44.9rem' }}>
                                   <NewRoleContent />
                              </div>

                              <div className="flex pt-4 justify-content-end gap-2">
                                   <Button label="Cancel" outlined severity="secondary" icon="pi pi-times" onClick={() => setStepperDialogVisible(false)} />
                                   <Button label="Siguiente" outlined icon="pi pi-arrow-right" iconPos="right" onClick={() => nextCallback()} />
                              </div>
                         </StepperPanel>
                         <StepperPanel header="PermissionsByRole">
                              <div style={{ overflow: 'auto', height: '44.9rem' }}>
                                   <div className="roles-stepper-container flex flex-column ">
                                        <div className="gap-2 p-3 flex-auto flex flex-column justify-content-start font-medium">
                                             <div>
                                                  <div>
                                                       <Message style={{ border: 'solid #696cff', borderWidth: '0 0 0 6px', color: '#696cff' }} className="border-primary w-full justify-content-start" severity="info" content={contentMessage} />
                                                  </div>
                                                  <div>
                                                       <ResoursesAccordion />
                                                  </div>
                                             </div>
                                        </div>
                                   </div>
                              </div>
                              <div className="flex pt-4 justify-content-end gap-2">
                                   <Button label="Atras" outlined severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current?.prevCallback()} />
                                   <Button label="Siguiente" outlined icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current?.nextCallback()} />
                              </div>
                         </StepperPanel>
                         <StepperPanel header="Users">
                              <div style={{ overflow: 'auto', height: '44.9rem' }}>
                                   <div className="roles-stepper-container">
                                        <UsersPickList />
                                   </div>
                              </div>
                              <div className="flex pt-4 justify-content-end gap-2">
                                   <Button label="Atras" outlined severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current?.prevCallback()} />
                                   <Button label="Siguiente" outlined icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current?.nextCallback()} />
                              </div>
                         </StepperPanel>
                         <StepperPanel header="Review">
                              <div style={{ overflow: 'auto', height: '44.9rem' }}>
                                   <div className="roles-stepper-container">
                                        <Review />
                                   </div>
                              </div>
                              <div className="flex pt-4 justify-content-end gap-2">
                                   <Button label="Atras" outlined severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current?.prevCallback()} />
                                   <Button label="Finish" outlined icon="pi pi-times" onClick={() => setStepperDialogVisible(false)} />
                              </div>
                         </StepperPanel>
                    </Stepper>
               </PermissionsByRoleProvider>
          )
     }

     const PermissionsTab = () => {
          return (
               <>
                    <TabView className='roles-tab-view' activeIndex={tabActiveIndex} onTabChange={(e) => setTabActiveIndex(e.index)}>
                         <TabPanel header="Users" leftIcon="pi pi-users mr-2">
                              <UsersDataTable userList={userList} permissionsByRole={permissionsByRole} loading={loading} setVisibleRight={setVisibleRight} />
                         </TabPanel>
                         <TabPanel header="Roles" rightIcon="pi pi-lock ml-2">
                              <RolesDatatable rolesData={rolesData} permissionsByRole={permissionsByRole} loading={loading} setVisibleRight={setVisibleRight} setStepperDialogVisible={setStepperDialogVisible} />
                         </TabPanel>
                         <TabPanel header="Pages" leftIcon="pi pi-clone mr-2">
                              AQUI COMPONENTE PARA MOSTRAR Y AGREGAR RESOURSES
                         </TabPanel>
                    </TabView>
                    <Dialog
                         header="New role"
                         visible={stepperDialogVisible}
                         style={{ width: '75vw', height: '90vh' }}
                         modal
                         maximizable
                         resizable={false}
                         contentStyle={{ height: '300px' }}
                         onHide={() => setStepperDialogVisible(false)} >
                         <RolesStepper />
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
                         </>
                    )}
          </>
     )
}

export default IndexRoles
