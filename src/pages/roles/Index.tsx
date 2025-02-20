import { AxiosError } from 'axios';
import { Toast } from 'primereact/toast';
import { Tree, TreeEventNodeEvent, TreeExpandedKeysType } from 'primereact/tree';
import { TreeNode } from 'primereact/treenode';
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Column, confirmDialog, ConfirmDialog, DataTable, Dialog } from '../../components/primereact/index';
import { ACTIONS } from '../../config/constants.d';
import { ActionsController, ResoursesController, RolesController } from '../../controllers';
import { useAuth } from "../../hooks";
import { Actions, ApiResultResponse, Resourses, Roles } from '../../types';
import './index.css';
import { ProgressBar } from 'primereact/progressbar';

const IndexRoles = () => {
     //..:: [ VARIABLES ] ::..
     const [resourse] = useState('roles')

     //..:: [ HOOKS ] ::..
     //const { t } = useTranslation();
     const navigate = useNavigate();
     //WARNING: ..:: [ Las siguientes lineas son obligatiorias para ejecutar los permisos ]::..
     const { userLoggedData, isAllowed, logout, hasAction, getPermissionList } = useAuth();
     const [permissions, setPermissions] = useState([] as Permissions[])
     const [rolesNodes, setRolesNodes] = useState<TreeNode[]>([]);
     const [resoursesNodes, setResoursesNodes] = useState<TreeNode[]>([]);
     const [selectedRoleKey, setSelectedRoleKey] = useState<string>('');
     const [selectedResourseKey, setSelectedResourseKey] = useState<string>('');
     const [actionsData, setActionsData] = useState([] as Actions[])

     //..::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..

     const [loading, setLoading] = useState<boolean>(true);
     const [expandedKeys] = useState<TreeExpandedKeysType>({ '0': true });
     //const [visibleRight, setVisibleRight] = useState<boolean>(false);
     const [dialogVisible, setDialogVisible] = useState(false);


     useEffect(() => {
          if (!isAllowed(resourse)) {
               navigate('/errors/403')
          }
          const permissions = getPermissionList(resourse) as unknown as Permissions[];
          setPermissions(permissions)
          getData()

     }, [])

     //..:: [ FUNCTIONS ] ::..

     const getData = async () => {
          setLoading(true)
          await loadRolesData();
          await loadResoursesData();
          await loadActionsData();
          setLoading(false)
     }

     const loadRolesData = async () => {
          try {
               const controller = new RolesController(userLoggedData?.token as string)
               const data = await controller.GetRoles() as unknown as ApiResultResponse;
               const list: Roles[] = data?.data as unknown as Roles[]
               const childrenNodes: TreeNode[] = [];

               list.map((role) => {
                    childrenNodes.push({
                         key: role._id,
                         label: role.roleName,
                         icon: 'pi pi-angle-right'
                    })
               })

               const nodes = [
                    {
                         key: '0',
                         label: 'User roles',
                         icon: 'pi pi-users',
                         children: childrenNodes
                    }
               ]
               setRolesNodes(nodes);
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
               const controller = new ResoursesController(userLoggedData?.token as string)
               const data = await controller.GetResourse() as unknown as ApiResultResponse;
               const list: Resourses[] = data?.data as unknown as Resourses[]
               const childrenNodes: TreeNode[] = [];

               list.map((resourse) => {
                    childrenNodes.push({
                         key: resourse._id,
                         label: resourse.resourseName,
                         icon: ' '
                    })
               })

               const nodes = [
                    {
                         key: '0',
                         label: 'Resourses / Pages',
                         icon: 'pi pi-inbox',
                         children: childrenNodes
                    }
               ]
               setResoursesNodes(nodes);
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
               const controller = new ActionsController(userLoggedData?.token as string)
               const data = await controller.GetActions() as unknown as ApiResultResponse;
               const list: Actions[] = data?.data as unknown as Actions[]
               setActionsData(list);
          } catch (err) {
               console.log('error: ', err)
               const error = err as unknown as AxiosError
               const errorMessage = (error?.response?.data as any).error
               if (errorMessage === 'Invalid Bearer token') {
                    alertModal();
               }
          }
     }

     const dialogFooterTemplate = () => {
          return <Button label="Cerrar" icon="pi pi-check" onClick={() => setDialogVisible(false)} />;
     };

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
          // <Navigate to="/" />
     }

     const [selectedActions, setSelectedActions] = useState<Actions[] | null>(null);
     const [resoursesSelected, setResoursesSelected] = useState<string[]>([])

     const [selectAll, setSelectAll] = useState<boolean>(false);
     const [totalRecords, setTotalRecords] = useState<number>(0);
     const toast = useRef<Toast>(null);

     const onActionSelectionChange = (event: any) => {
          const value = event.value;
          setSelectedActions(value);
          setSelectAll(value.length === totalRecords);
          console.clear()
          console.table(value)
     };

     const onActionsSelectAllChange = (event: any) => {
          const selectAll = event.checked;

          if (selectAll) {
               setSelectAll(true);
               setTotalRecords(actionsData.length)
               setSelectedActions(actionsData);
               console.clear()
               console.table(actionsData)
          } else {
               setSelectAll(false);
               setSelectedActions([]);
          }
     };

     const onSelectResourse = (event: TreeEventNodeEvent) => {
          //toast.current?.show({ severity: 'info', summary: 'Node Selected', detail: event.node.key });
          if (event.node.key === '0') {
               setResoursesSelected([])
               const selectedResourses = resoursesNodes[0].children?.map(f => f.key)
               setResoursesSelected(selectedResourses as string[])
          }
          else {
               addResourseToList(event.node.key as string)
          }
     };

     const onUnselectResourse = (event: TreeEventNodeEvent) => {
          //toast.current?.show({ severity: 'info', summary: 'Node Unselected', detail: event.node.key });
          if (event.node.key === '0') {
               setResoursesSelected([])
          }
          else {
               removeResourseToList(event.node.key as string)
          }
     };

     const addResourseToList = (id: string) => {
          resoursesSelected.push(id)
          setResoursesSelected(resoursesSelected)
          console.clear()
          console.table(resoursesSelected)
     }

     const removeResourseToList = (id: string) => {
          const newList = resoursesSelected.filter(f => f !== id)
          setResoursesSelected(newList)
          console.clear()
          console.table(resoursesSelected)
     }

     const datatable = () => {
          return (
               <>
                    {loading && <ProgressBar mode="indeterminate" style={{ height: '1px' }}></ProgressBar>}

                    <div className="card-container h-full flex justify-content-around gap-3 p-2">
                         <Card className='w-full'>
                              <div className='flex gap-2'>
                                   <Button icon="pi pi-plus" label="Nuevo"></Button>
                                   <Button icon="pi pi-trash" label="Eliminar"></Button>
                              </div>
                              <Tree
                                   value={rolesNodes} selectionMode="single"
                                   expandedKeys={expandedKeys}
                                   selectionKeys={selectedRoleKey}
                                   onSelectionChange={(e) => {
                                        console.log('e.value: ', e.value)
                                        setSelectedRoleKey(e.value as string)
                                   }
                                   } className="w-full" />
                         </Card>
                         <Card className='w-full'>
                              <div className='flex gap-2'>
                                   <Button icon="pi pi-plus" label="Nuevo" onClick={() => console.table(resoursesSelected)}></Button>
                                   <Button icon="pi pi-trash" label="Eliminar"></Button>
                              </div>
                              <Tree
                                   value={resoursesNodes}
                                   selectionMode="checkbox"
                                   expandedKeys={expandedKeys}
                                   selectionKeys={selectedResourseKey}
                                   onSelectionChange={(e) => setSelectedResourseKey(e.value as string)}
                                   onSelect={onSelectResourse}
                                   onUnselect={onUnselectResourse}
                                   className="w-full"
                              />
                         </Card>
                         <Card className='w-full'>
                              <DataTable value={actionsData} lazy filterDisplay="menu" dataKey="_id" className='p-3'
                                   selection={selectedActions}
                                   onSelectionChange={onActionSelectionChange}
                                   selectAll={selectAll}
                                   onSelectAllChange={onActionsSelectAllChange}
                              >
                                   <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                                   <Column field="_id" header="id" hidden />
                                   <Column field="actionName" header="Acción" />
                              </DataTable>
                         </Card>
                         <Toast ref={toast} />
                    </div>
                    <div className='w-full flex justify-content-end pt-2 pr-2'>
                         <Button icon="pi pi-save" label="Guardar" onClick={() => console.table(resoursesSelected)}></Button>
                    </div>
               </>
          )
     }

     return (
          <>
               {permissions && hasAction(ACTIONS.LIST) &&
                    (
                         <>
                              <div className='w-full pt-2 px-3 pb-2 flex justify-content-between align-items-center'>
                                   <span className='text-2xl'>Permission</span>
                                   <Button icon="pi pi-external-link" rounded text onClick={() => setDialogVisible(true)} />
                              </div>
                              <>
                                   {datatable()}
                                   <Dialog header="Permission" visible={dialogVisible} style={{ width: '75vw' }} maximizable
                                        modal contentStyle={{ height: 'auto' }} onHide={() => setDialogVisible(false)} footer={dialogFooterTemplate}>
                                        {
                                             <>{datatable()}</>
                                        }
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
                              </>
                         </>
                    )}
          </>
     )
}
export default IndexRoles