import { ROLES_ENDPOINT } from "../config/constants.d";
import AppService from "../services/AppService";
import { Role, UserDataToken } from "../types";

export class RoleController {

     _userDataToken: UserDataToken

     constructor(userDataToken: UserDataToken) {
          this._userDataToken = userDataToken;
     }

     public AddRole = async (role: Role): Promise<string | undefined> => {
          const service = new AppService(this._userDataToken, ROLES_ENDPOINT);
          try {
               const data = await service.Post(role)
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

     public UpdateRole = async (role: Role): Promise<string | undefined> => {
          const service = new AppService(this._userDataToken, ROLES_ENDPOINT);
          try {
               const data = await service.Put(role)
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

     public DeleteRole = async (role: Role): Promise<string | undefined> => {
          const service = new AppService(this._userDataToken, ROLES_ENDPOINT);
          try {
               const data = await service.Delete(role)
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

     public GetRoles = async (): Promise<string | undefined> => {
          const service = new AppService(this._userDataToken, ROLES_ENDPOINT);
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