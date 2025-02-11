import { AuthService } from "../services/AuthService";

export class AuthController {

     static Login = async (email: string, password: string): Promise<string | undefined> => {
          try {
               const data = await AuthService.Login(email, password)
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