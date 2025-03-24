import { CATEGORY_ENDPOINT, IMAGE_UPLOAD_ENDPOINT } from "../config/constants.d";
import AppService from "../services/AppService";
import { Category, UserDataToken } from "../types";

export class CategoryController {

     _userDataToken: UserDataToken

     constructor(userDataToken: UserDataToken) {
          this._userDataToken = userDataToken;
     }

     public GetCategories = async (): Promise<string | undefined> => {
          const service = new AppService(this._userDataToken, CATEGORY_ENDPOINT);
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

     public Create = async (category: Category): Promise<string | undefined> => {
          const service = new AppService(this._userDataToken, CATEGORY_ENDPOINT);
          try {
               const data = await service.Post(category)
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

     public Update = async (category: Category): Promise<string | undefined> => {
          const service = new AppService(this._userDataToken, CATEGORY_ENDPOINT);
          try {
               const data = await service.Put(category)
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

     public Delete = async (category: Category): Promise<string | undefined> => {
          const service = new AppService(this._userDataToken, CATEGORY_ENDPOINT);
          try {
               const data = await service.Delete(category)
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

     public UploadImage = async (formData: FormData): Promise<string | undefined> => {
          const service = new AppService(this._userDataToken, IMAGE_UPLOAD_ENDPOINT);
          try {
               const data = await service.UploadImage(formData)
                    .catch(error => {
                         throw error;
                    });
               if (data) {
                    return data;
               }
          } catch (error) {
               //TODO: Registart el error en un archivo log o base de datos
               throw error;
          }
     }

     public UpdateImage = async (formData: FormData): Promise<string | undefined> => {
          const service = new AppService(this._userDataToken, IMAGE_UPLOAD_ENDPOINT);
          try {
               const data = await service.UpdateImage(formData)
                    .catch(error => {
                         throw error;
                    });
               if (data) {
                    return data;
               }
          } catch (error) {
               //TODO: Registart el error en un archivo log o base de datos
               throw error;
          }
     }

}