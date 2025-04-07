import { TAXES_ENDPOINT } from "../config/constants.d";
import AppService from "../services/AppService";
import { Taxes, UserDataToken } from "../types";

export class TaxController {

     _userDataToken: UserDataToken

     constructor(userDataToken: UserDataToken) {
          this._userDataToken = userDataToken;
     }

     public AddTax = async (tax: Taxes): Promise<string | undefined> => {
          const service = new AppService(this._userDataToken, TAXES_ENDPOINT);
          try {
               const data = await service.Post(tax)
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

     public UpdateTax = async (tax: Taxes): Promise<string | undefined> => {
          const service = new AppService(this._userDataToken, TAXES_ENDPOINT);
          try {
               const data = await service.Put(tax)
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

     public DeleteTax = async (tax: Taxes): Promise<string | undefined> => {
          const service = new AppService(this._userDataToken, TAXES_ENDPOINT);
          try {
               const data = await service.Delete(tax)
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

     public GetTaxes = async (): Promise<string | undefined> => {
          const service = new AppService(this._userDataToken, TAXES_ENDPOINT);
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