import { DISCOUNTS_ENDPOINT } from "../config/constants.d";
import AppService from "../services/AppService";
import { Discount, UserDataToken } from "../types";

export class DiscountController {

     _userDataToken: UserDataToken

     constructor(userDataToken: UserDataToken) {
          this._userDataToken = userDataToken;
     }

     public AddDiscount = async (discount: Discount): Promise<string | undefined> => {
          const service = new AppService(this._userDataToken, DISCOUNTS_ENDPOINT);
          try {
               const data = await service.Post(discount)
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

     public UpdateDiscount = async (discount: Discount): Promise<string | undefined> => {
          const service = new AppService(this._userDataToken, DISCOUNTS_ENDPOINT);
          try {
               const data = await service.Put(discount)
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

     public DeleteDiscount = async (discount: Discount): Promise<string | undefined> => {
          const service = new AppService(this._userDataToken, DISCOUNTS_ENDPOINT);
          try {
               const data = await service.Delete(discount)
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

     public GetDiscounts = async (): Promise<string | undefined> => {
          const service = new AppService(this._userDataToken, DISCOUNTS_ENDPOINT);
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