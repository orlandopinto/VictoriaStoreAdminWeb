import { Card } from "primereact/card";
import { Navigate } from "react-router-dom";
import Layout from "../../components/common/Layout";

interface Props {
     roles: string[]
}

function Statistics({ roles }: Props) {
     return (
          <Layout >
               <Card>
                    <div className="text-center w-full">
                         {!roles.includes('admin') ? (
                              <Navigate to="/noaccess" />
                         ) : (
                              <h1>Statistics Page</h1>
                         )}
                    </div>
               </Card>
          </Layout >
     );
}
export default Statistics