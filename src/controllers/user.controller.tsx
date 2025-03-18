import { IMAGE_UPLOAD_ENDPOINT, SING_UP_ENDPOINT, USER_ENDPOINT } from "../config/constants.d";
import AppService from "../services/AppService";
import { RegisterUser, UserDataToken } from '../types/user-data.type';

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

     public Register = async (user: RegisterUser): Promise<string | undefined> => {
          const service = new AppService(this._userDataToken, SING_UP_ENDPOINT);
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

}