import { SUB_CATEGORY_ENDPOINT } from "../config/constants.d";
import AppService from "../services/AppService";
import { SubCategory, UserDataToken } from "../types";

export class SubCategoryController {

     _userDataToken: UserDataToken

     constructor(userDataToken: UserDataToken) {
          this._userDataToken = userDataToken;
     }

     public Create = async (subCategory: SubCategory): Promise<string | undefined> => {
          const service = new AppService(this._userDataToken, SUB_CATEGORY_ENDPOINT);
          try {
               const data = await service.Post(subCategory)
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

     public Update = async (subCategory: SubCategory): Promise<string | undefined> => {
          const service = new AppService(this._userDataToken, SUB_CATEGORY_ENDPOINT);
          try {
               const data = await service.Put(subCategory)
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

     public Delete = async (subCategory: SubCategory): Promise<string | undefined> => {
          const service = new AppService(this._userDataToken, SUB_CATEGORY_ENDPOINT);
          try {
               const data = await service.Delete(subCategory)
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

     public GetSubCategories = async (): Promise<string | undefined> => {
          const service = new AppService(this._userDataToken, SUB_CATEGORY_ENDPOINT);
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