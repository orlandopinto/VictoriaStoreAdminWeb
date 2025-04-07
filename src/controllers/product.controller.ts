import { PRODUCTS_ENDPOINT } from "../config/constants.d";
import AppService from "../services/AppService";
import { Product, UserDataToken } from "../types";

export class ProductController {

     _userDataToken: UserDataToken

     constructor(userDataToken: UserDataToken) {
          this._userDataToken = userDataToken;
     }

     public AddProduct = async (product: Product): Promise<string | undefined> => {
          const service = new AppService(this._userDataToken, PRODUCTS_ENDPOINT);
          try {
               const data = await service.Post(product)
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

     public UpdateProduct = async (product: Product): Promise<string | undefined> => {
          const service = new AppService(this._userDataToken, PRODUCTS_ENDPOINT);
          try {
               const data = await service.Put(product)
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

     public DeleteProduct = async (product: Product): Promise<string | undefined> => {
          const service = new AppService(this._userDataToken, PRODUCTS_ENDPOINT);
          try {
               const data = await service.Delete(product)
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

     public GetProducts = async (): Promise<string | undefined> => {
          const service = new AppService(this._userDataToken, PRODUCTS_ENDPOINT);
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