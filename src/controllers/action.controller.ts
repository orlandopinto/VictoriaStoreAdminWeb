import { ACTIONS_ENDPOINT } from "../config/constants.d";
import AppService from "../services/AppService";

export class ActionController {

     token: string

     constructor(token: string) {
          this.token = token as string;
     }

     public GetActions = async (): Promise<string | undefined> => {
          const service = new AppService(this.token, ACTIONS_ENDPOINT);
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