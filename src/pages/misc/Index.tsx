import { Card } from "primereact/card";
//import { useState } from "react";
//import AlertDialog from "../../components/common/AlertDialog";
import DiscountsDatatable from "./DiscountsDatatable";
import TaxesDatatable from "./TaxesDatatable";
import './index.css';

const IndexMiscelaneos = () => {

     //..:: [ HOOKS ] ::..
     //WARNING: ..:: [ Las siguientes lineas son obligatiorias para ejecutar los permisos ]::..
     //const { logout } = useAuth();
     //const [showAlertModal, setShowAlertModal] = useState(false);

     return (
          <>
               <div className='w-full pt-2 pb-3 flex justify-content-between align-items-center'>
                    <span className='text-2xl'>Miscelaneos</span>
               </div>
               <div className="grid pt-2">
                    <div className="col">
                         <Card>
                              <div className='pt-2 pb-3 flex justify-content-between align-items-center'>
                                   <span className='text-2xl'>Taxes</span>
                              </div>
                              <TaxesDatatable />
                         </Card>
                    </div>
                    <div className="col">
                         <Card>
                              <div className='pt-2 pb-3 flex justify-content-between align-items-center'>
                                   <span className='text-2xl'>Discounts</span>
                              </div>
                              <DiscountsDatatable />
                         </Card>
                    </div>
               </div>
               <div className="grid pt-2">
                    <div className="col-6">
                         <Card>
                              <div className='pt-2 pb-3 flex justify-content-between align-items-center'>
                                   <span className='text-2xl'>Attributes</span>
                              </div>

                         </Card>
                    </div>
               </div>
               {/* <AlertDialog showAlertModal={showAlertModal} setShowAlertModal={setShowAlertModal} /> */}
          </>
     )
}
export default IndexMiscelaneos