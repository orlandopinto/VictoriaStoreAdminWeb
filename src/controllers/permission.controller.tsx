import { PERMISSION_ENDPOINT } from "../config/constants.d";
import AppService from "../services/AppService";

export class PermissionController {

     token: string

     constructor(token: string) {
          this.token = token as string;
     }

     public Get = async (): Promise<string | undefined> => {
          const service = new AppService(this.token, PERMISSION_ENDPOINT);
          try {
               const data = await service.Get()
                    .catch(error => {
                         throw error;
                    });
               if (data) {
                    return data;
               }
          } catch (error) {
               //TODO: Registar el error en un archivo log o base de datos
               throw error;
          }
     }

}