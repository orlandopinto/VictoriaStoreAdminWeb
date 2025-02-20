import React, { createContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Data, Permissions } from "../types";
import { encrypt } from "../utils";
import { decrypt } from '../utils/EncryptDecryptManager';

type Props = { children: React.ReactNode }

type AuthContextType = {
     userLoggedData: Data | null;
     storeSessionData: (userData: Data, permissions: Permissions[]) => void;
     logout: () => void;
     isAuthenticated: () => boolean
     isAllowed: (resourse: string) => boolean
     getPermissionList: (resourse: string) => Permissions[]
     hasAction: (actionName: string) => boolean | undefined
};

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: Props) => {
     const [isReady, setIsReady] = useState(false);
     const [userLoggedData, setLoggedData] = useState<Data | null>(null)

     useEffect(() => {
          setIsReady(true)
          if (sessionStorage.getItem('authorization')) {
               setLoggedData(getUserLoggedData())
          }
     }, [])

     const storeSessionData = (userData: Data, permissions: any[]) => {
          sessionStorage.setItem('authorization', encrypt(JSON.stringify(userData)))
          sessionStorage.setItem('permissions', encrypt(JSON.stringify(permissions)))
          setLoggedData(userData)
          setIsReady(true)
     }

     const logout = () => {
          sessionStorage.removeItem('authorization')
          sessionStorage.removeItem('permissions')
          setLoggedData(null)
          setIsReady(false);
          <Navigate to="/account/login" />
     }

     const isAuthenticated = (): boolean => {
          return sessionStorage.getItem('authorization') ? !!getUserLoggedData() : false
     }

     const isAllowed = (resourse: string): boolean => {
          return !!getPermissionList(resourse).find(f => f.resourseName === resourse);
     }

     const getPermissionList = (resourse: string): Permissions[] => {
          setLoggedData(getUserLoggedData())

          let ListOfAvailableResources: Permissions[] = [];
          getUserLoggedData().userData.roles.map((role) => {
               let data = getPermissionsList().filter(f => f.resourseName === resourse && f.roleName === role)
               ListOfAvailableResources = ListOfAvailableResources.concat(data!)
          })
          return ListOfAvailableResources;
     }

     const hasAction = (actionName: string): boolean | undefined => {
          return getPermissionsList().some(f => f.actionName === actionName && getUserLoggedData().userData.roles.includes(f.roleName))
     }

     const getPermissionsList = (): Permissions[] => {
          return JSON.parse(decrypt(sessionStorage.getItem('permissions')!)) as unknown as Permissions[]
     }

     const getUserLoggedData = (): Data => {
          return JSON.parse(decrypt(sessionStorage.getItem('authorization')!)) as unknown as Data
     }

     return <AuthContext.Provider value={{ storeSessionData, userLoggedData, logout, isAuthenticated, isAllowed, getPermissionList, hasAction }}>
          {isReady ? children : null}
     </AuthContext.Provider>
}