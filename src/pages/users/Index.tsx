import { Card } from "primereact/card"
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../context/AuthContext";

function IndexUser() {
     const { t } = useTranslation();
     const { authProfile } = useContext(AuthContext);
     // const userData = authProfile as unknown as AuthProfile
     console.log('authProfile: ', authProfile)
     return (
          <Card>
               <div className="text-center w-full">
                    <h2>{authProfile?.userName}</h2>
                    <h2>{authProfile?.email}</h2>
                    <h2>{authProfile?.fullName}</h2>
                    <hr />
                    <h1>{t('welcome')}</h1>
                    <h1>{t('titles.page1')}</h1>
                    <h1>{t('titles.page2')}</h1>
                    <h5>Users Page</h5>
               </div>
          </Card>
     )
}
export default IndexUser