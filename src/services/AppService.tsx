import axios, { AxiosHeaders, AxiosInstance } from "axios";
import { _Headers, IMAGE_UPLOAD_ENDPOINT, METHOD, REFRESH_TOKEN_ENDPOINT, URL_BASE } from "../config/constants.d";
import { ApiResultResponse, RefreshTokenType, UserDataToken } from "../types";

export default class AppService {
     headers: _Headers = new Headers();
     imageHeaders: _Headers = new Headers();
     ENDPOINT: string;
     UPLOAD_IMAGE_ENDPOINT: string | undefined;
     api: AxiosInstance;

     constructor(userDataToken: UserDataToken, ENDPOINT: string) {
          this.ENDPOINT = `${URL_BASE}${ENDPOINT}`;
          this.UPLOAD_IMAGE_ENDPOINT = `${URL_BASE}${IMAGE_UPLOAD_ENDPOINT}`;
          this.headers = {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${userDataToken.accessToken}`,
          };
          this.imageHeaders = {
               "Content-Type": "multipart/form-data"
          };
          this.api = axios.create({ baseURL: this.ENDPOINT });

          this.api.interceptors.response.use((response) => response, async (error) => {
               const originalRequest = error.config;

               // If the error status is 401 and there is no originalRequest._retry flag,
               // it means the token has expired and we need to refresh it
               if (error.response.status === 403 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    try {
                         const params: RefreshTokenType = {
                              email: userDataToken.userData.email,
                              accessToken: userDataToken.accessToken,
                              refreshToken: userDataToken.refreshToken
                         }

                         const response = await axios.post(`${URL_BASE}${REFRESH_TOKEN_ENDPOINT}`, params);
                         const { data } = response.data as unknown as ApiResultResponse;
                         let refreshTokenType = data as unknown as RefreshTokenType

                         if (userDataToken) {
                              userDataToken.accessToken = refreshTokenType.accessToken!;
                              userDataToken.refreshToken = refreshTokenType.refreshToken!;
                         }

                         originalRequest.headers.Authorization = `Bearer ${refreshTokenType.accessToken}`;
                         return axios(originalRequest);
                    } catch (error) {
                         throw error
                    }
               }

               return Promise.reject(error);
          });
     }

     public async Get(): Promise<string> {

          try {
               const result = await this.api({
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

     public async Post<T>(data: T): Promise<string> {

          try {
               const result = await this.api({
                    url: this.ENDPOINT,
                    method: METHOD.POST,
                    headers: this.headers as AxiosHeaders,
                    data: JSON.stringify(data)
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

     public async Put<T>(data: T): Promise<string> {

          try {
               const result = await this.api({
                    url: this.ENDPOINT,
                    method: METHOD.PUT,
                    headers: this.headers as AxiosHeaders,
                    data: JSON.stringify(data)
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

     public async Delete<T>(data: T): Promise<string> {

          try {
               const result = await this.api({
                    url: this.ENDPOINT,
                    method: METHOD.DELETE,
                    headers: this.headers as AxiosHeaders,
                    data: JSON.stringify(data)
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

     public async UploadImage(formData: FormData): Promise<string> {

          try {
               const result = await this.api({
                    url: this.UPLOAD_IMAGE_ENDPOINT,
                    method: METHOD.POST,
                    headers: this.imageHeaders as AxiosHeaders,
                    data: formData
               })
                    .then(res => {
                         return res.data
                    })
                    .catch(err => {
                         throw err
                    })
               return result
          } catch (error) {
               throw error
          }

     }

}