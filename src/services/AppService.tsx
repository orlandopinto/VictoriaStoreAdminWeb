import axios, { AxiosHeaders } from "axios";
import { _Headers, METHOD, URL_BASE } from "../config/constants.d";

export default class AppService {
     headers: _Headers = new Headers();
     ENDPOINT: string;

     constructor(token: string, ENDPOINT: string) {
          this.ENDPOINT = `${URL_BASE}${ENDPOINT}`;
          this.headers = {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${token}`,
          };
     }

     public async Get(): Promise<string> {

          try {
               const result = await axios({
                    url: this.ENDPOINT,
                    method: METHOD.GET,
                    headers: this.headers as AxiosHeaders
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