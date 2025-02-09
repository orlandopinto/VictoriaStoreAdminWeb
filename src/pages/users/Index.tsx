import { Card } from "primereact/card"
import { useTranslation } from "react-i18next";

function IndexUser() {
     const { t } = useTranslation();
     return (
          <Card>
               <div className="text-center w-full">
                    <h1>{t('welcome')}</h1>
                    <h1>{t('titles.page1')}</h1>
                    <h1>{t('titles.page2')}</h1>
                    <h5>Users Page</h5>
               </div>
          </Card>
     )
}
export default IndexUser