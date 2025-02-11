import axios from "axios";
import { AUTH_ENDPOINT, METHOD, URL_BASE } from "../config/constants.d";

export class AuthService {

     static async Login(email: string, password: string) {

          try {
               const result = await axios({
                    url: `${URL_BASE}${AUTH_ENDPOINT}/signin`,
                    method: METHOD.POST,
                    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                    data: { "email": email, "password": password }
               })
                    .then(res => res.data)
                    .catch(err => {
                         throw err
                    })
               return result
          } catch (error) {
               throw error
          }

     }
}