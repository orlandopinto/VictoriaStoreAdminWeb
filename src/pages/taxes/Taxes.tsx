import { Card } from "primereact/card";
//import { useEffect, useState } from "react";
//import { useNavigate } from "react-router-dom";
//import { ACTIONS } from "../../config/constants.d";
//import { useAuth } from "../../hooks";
//import { Permissions } from "../../types";

function Taxes() {
     //WARNING: ..:: [ Las siguientes lineas son obligatiorias para ejecutar los permisos ]::..
     // const [resourse] = useState('taxes')
     // const { getPermissionList, isAllowed } = useAuth();
     // const permissions = getPermissionList(resourse) as unknown as Permissions;
     // const [permission] = useState(permissions)

     // const navigate = useNavigate();

     // useEffect(() => {
     //      console.log('permission: ', permission, isAllowed(resourse))
     //      if (!isAllowed(resourse)) {
     //           navigate('/errors/403')
     //      }
     //      //getData()
     // }, [])
     //..::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..

     return (
          <Card>
               <div className="text-center w-full">
                    <h1>TAXES Page</h1>
                    <div className="flex justify-content-end gap-2">
                         <i className="pi pi-eye" style={{ fontSize: '1.2rem', cursor: 'pointer' }}></i>
                         <i className="pi pi-user-edit" style={{ fontSize: '1.2rem', cursor: 'pointer' }} ></i>
                         <i className="pi pi-trash" style={{ fontSize: '1.2rem', cursor: 'pointer' }} ></i>
                         {/* {permission && permission.actions.includes(ACTIONS.VIEW) && <i className="pi pi-eye" style={{ fontSize: '1.2rem', cursor: 'pointer' }}></i>}
                         {permission && permission.actions.includes(ACTIONS.UPDATE) && <i className="pi pi-user-edit" style={{ fontSize: '1.2rem', cursor: 'pointer' }} ></i>}
                         {permission && permission.actions.includes(ACTIONS.DELETE) && <i className="pi pi-trash" style={{ fontSize: '1.2rem', cursor: 'pointer' }} ></i>} */}
                    </div>
               </div>
               {/* {permission && permission.actions.includes(ACTIONS.LIST) &&
                    <div>
                         <table className="table w-full">
                              <thead>
                                   <tr>
                                        <th>HEADER UNO</th>
                                        <th>HEADER DOS</th>
                                   </tr>
                              </thead>
                              <tbody>
                                   <tr>
                                        <td>contenido uno</td>
                                        <td>contenido dos</td>
                                   </tr>
                              </tbody>
                         </table>
                    </div>
               } */}
               <div>
                    <table className="table w-full">
                         <thead>
                              <tr>
                                   <th>HEADER UNO</th>
                                   <th>HEADER DOS</th>
                              </tr>
                         </thead>
                         <tbody>
                              <tr>
                                   <td>contenido uno</td>
                                   <td>contenido dos</td>
                              </tr>
                         </tbody>
                    </table>
               </div>
          </Card>

     )
}

export default Taxes