import React, { createContext, useEffect, useState } from "react";
import { AuthProfile } from "../types/auth-profile.type";
import { decrypt, encrypt } from "../utils/EncryptDecryptManager";

type Props = { children: React.ReactNode }

type AuthContextType = {
     authProfile: AuthProfile | null;
     loginUser: (authProfile: AuthProfile) => void;
     logout: () => void;
     isAuthenticated: () => boolean
};

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: Props) => {
     const [authProfile, setAuthProfile] = useState<AuthProfile | null>(null);
     const [isReady, setIsReady] = useState(false)

     useEffect(() => {
          const ciphertext: string | null = localStorage.getItem("authorization")
          const authProfile = ciphertext ? decrypt(ciphertext) : null
          if (authProfile) {
               setAuthProfile(JSON.parse(authProfile));
          }
          //console.log('useEffect: ', authProfile)
          setIsReady(true)
     }, [])

     const loginUser = (authProfile: AuthProfile) => {
          localStorage.setItem("authorization", encrypt(JSON.stringify(authProfile)))
          setAuthProfile(authProfile);
          setIsReady(true)
          //console.log('AuthProvider - loginUser: ', authProfile)
     }

     const logout = () => {
          localStorage.removeItem("authorization")
          setAuthProfile(null)
          setIsReady(false)
     }

     const isAuthenticated = (): boolean => {
          return !!localStorage.getItem("authorization") && !!authProfile
     }

     return <AuthContext.Provider value={{ loginUser, authProfile, logout, isAuthenticated }}>
          {isReady ? children : null}
     </AuthContext.Provider>
}