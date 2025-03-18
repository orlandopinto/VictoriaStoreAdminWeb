import { ACTIONS_ENDPOINT } from "../config/constants.d";
import AppService from "../services/AppService";
import { UserDataToken } from "../types";

export class ActionController {

     _userDataToken: UserDataToken

     constructor(userDataToken: UserDataToken) {
          this._userDataToken = userDataToken;
     }

     public GetActions = async (): Promise<string | undefined> => {
          const service = new AppService(this._userDataToken, ACTIONS_ENDPOINT);
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