import { Card } from "primereact/card";
import { Navigate } from "react-router-dom";

interface Props {
     roles: string[]
}

function Statistics({ roles }: Props) {
     return (
          <Card>
               <div className="text-center w-full">
                    {!roles.includes('admin') ? (
                         <Navigate to="/errors/403" />
                    ) : (
                         <h1>Statistics Page</h1>
                    )}
               </div>
          </Card>
     );
}
export default Statistics