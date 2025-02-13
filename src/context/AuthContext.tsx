import React, { createContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserPermission } from "../types";
import { AuthProfile } from "../types/auth-profile.type";
import { decrypt, encrypt } from "../utils/EncryptDecryptManager";

type Props = { children: React.ReactNode }

type AuthContextType = {
     authProfile: AuthProfile | null;
     loginUser: (authProfile: AuthProfile) => void;
     logout: () => void;
     isAuthenticated: () => boolean
     getPermission: (resourse: string) => UserPermission
     isAllowed: (resourse: string) => boolean
};

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: Props) => {
     const [authProfile, setAuthProfile] = useState<AuthProfile | null>(null);
     const [isReady, setIsReady] = useState(false);

     useEffect(() => {
          const ciphertext: string | null = localStorage.getItem("authorization")
          const authProfile = ciphertext ? decrypt(ciphertext) : null
          if (authProfile) {
               setAuthProfile(JSON.parse(authProfile));
          }
          setIsReady(true)
     }, [])

     const loginUser = (authProfile: AuthProfile) => {
          localStorage.setItem("authorization", encrypt(JSON.stringify(authProfile)))
          setAuthProfile(authProfile);
          setIsReady(true)
     }

     const logout = () => {
          localStorage.removeItem("authorization")
          setIsReady(false);
          <Navigate to="/account/login" />
     }

     const isAuthenticated = (): boolean => {
          return !!localStorage.getItem("authorization") && !!authProfile
     }

     const getPermission = (resourse: string): UserPermission => {
          const permissions = authProfile?.user.permissions as UserPermission[];
          const valor = permissions.find(f => f.resourse === resourse) as UserPermission
          return valor;
     }

     const isAllowed = (resourse: string): boolean => {
          const permissions = authProfile?.user.permissions as UserPermission[];
          const valor = permissions.find(f => f.resourse === resourse) as UserPermission
          return !!valor;
     }

     return <AuthContext.Provider value={{ loginUser, authProfile, logout, isAuthenticated, getPermission, isAllowed }}>
          {isReady ? children : null}
     </AuthContext.Provider>
}