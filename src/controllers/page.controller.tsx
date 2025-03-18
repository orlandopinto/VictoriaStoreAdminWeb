import { PAGES_ENDPOINT } from "../config/constants.d";
import AppService from "../services/AppService";
import { Page, UserDataToken } from "../types";

export class PageController {

     _userDataToken: UserDataToken

     constructor(userDataToken: UserDataToken) {
          this._userDataToken = userDataToken;
     }

     public AddPage = async (page: Page): Promise<string | undefined> => {
          const service = new AppService(this._userDataToken, PAGES_ENDPOINT);
          try {
               const data = await service.Post(page)
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

     public DeletePage = async (page: Page): Promise<string | undefined> => {
          const service = new AppService(this._userDataToken, PAGES_ENDPOINT);
          try {
               const data = await service.Delete(page)
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

     public GetPages = async (): Promise<string | undefined> => {
          const service = new AppService(this._userDataToken, PAGES_ENDPOINT);
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