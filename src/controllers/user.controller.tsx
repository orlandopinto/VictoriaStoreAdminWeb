import { CHANGE_PASSWORD_ENDPOINT, DELETE_USER_ENDPOINT, IMAGE_UPLOAD_ENDPOINT, USER_ENDPOINT, UPDATE_USER_ENDPOINT } from "../config/constants.d";
import AppService from "../services/AppService";
import { ChangePassword, RegisterUser, UpdateUser, UserData, UserDataToken } from '../types/user-data.type';

export class UserController {

     _userDataToken: UserDataToken

     constructor(userDataToken: UserDataToken) {
          this._userDataToken = userDataToken;
     }

     public GetUsers = async (): Promise<string | undefined> => {
          const service = new AppService(this._userDataToken, USER_ENDPOINT);
          try {
               const data = await service.Get()
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

     public Create = async (user: RegisterUser): Promise<string | undefined> => {
          const service = new AppService(this._userDataToken, USER_ENDPOINT);
          try {
               const data = await service.Post(user)
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

     public Update = async (user: UpdateUser): Promise<string | undefined> => {
          const service = new AppService(this._userDataToken, UPDATE_USER_ENDPOINT);
          try {
               const data = await service.Put(user)
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

     public ChangePassword = async (params: ChangePassword): Promise<string | undefined> => {
          const service = new AppService(this._userDataToken, CHANGE_PASSWORD_ENDPOINT);
          try {
               const data = await service.ChangePassword(params)
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

     public Delete = async (user: UserData): Promise<string | undefined> => {
          const service = new AppService(this._userDataToken, DELETE_USER_ENDPOINT);
          try {
               const data = await service.Delete(user)
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