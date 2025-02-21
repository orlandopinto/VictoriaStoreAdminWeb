import React, { createContext, useEffect, useMemo, useState } from 'react';
import { UserDataToken } from '../types';
import { decrypt, encrypt } from '../utils/EncryptDecryptManager';

type Permissions = {
     resourseName: string;
     roleName: string;
     actionName: string;
};

type Props = { children: React.ReactNode };

type AuthContextType = {
     isReady: boolean
     getToken(): string
     userLoggedData: UserDataToken | null;
     storeSessionData: (userDataToken: UserDataToken, permissions: Permissions[]) => void;
     logout: () => void;
     isAuthenticated: () => boolean;
     isAllowed: (resource: string) => boolean;
     getPermissionList: (resource: string) => Permissions[];
     hasAction: (actionName: string) => boolean | undefined;
};

// Create context
export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Provider component
export const AuthProvider = ({ children }: Props) => {
     const [isReady, setIsReady] = useState(false);
     const [userLoggedData, setLoggedData] = useState<UserDataToken | null>(null);

     // Utility functions
     const getUserLoggedData = (): UserDataToken | null => {
          try {
               const authData = sessionStorage.getItem('authorization');
               return authData ? JSON.parse(decrypt(authData)) : null;
          } catch (error) {
               console.error('Error retrieving user data:', error);
               return null;
          }
     };

     const getPermissionsList = (): Permissions[] => {
          try {
               const permissionsData = sessionStorage.getItem('permissions');
               return permissionsData ? JSON.parse(decrypt(permissionsData)) : [];
          } catch (error) {
               console.error('Error retrieving permissions:', error);
               return [];
          }
     };

     // Context methods
     const storeSessionData = (userDataToken: UserDataToken, permissions: Permissions[]) => {
          try {
               sessionStorage.setItem('authorization', encrypt(JSON.stringify(userDataToken)));
               sessionStorage.setItem('permissions', encrypt(JSON.stringify(permissions)));
               setLoggedData(userDataToken);
               setIsReady(true);
          } catch (error) {
               console.error('Error storing session data:', error);
          }
     };

     const logout = () => {
          try {
               sessionStorage.removeItem('authorization');
               sessionStorage.removeItem('permissions');
               setLoggedData(null);
               setIsReady(false);
               // Redirect to login page
               window.location.href = '/account/login'; // Use window.location for immediate navigation
          } catch (error) {
               console.error('Error during logout:', error);
          }
     };

     const isAuthenticated = useMemo(() => {
          return () => !!sessionStorage.getItem('authorization') && !!getUserLoggedData();
     }, []);

     const isAllowed = (resource: string): boolean => {
          const permissions = getPermissionList(resource);
          return !!permissions.find((perm) => perm.resourseName === resource);
     };

     const getPermissionList = (resource: string): Permissions[] => {
          const permissions = getPermissionsList();
          const roles = userLoggedData?.userData.roles || [];
          return permissions.filter(
               (perm) => perm.resourseName === resource && roles.includes(perm.roleName)
          );
     };

     const hasAction = (actionName: string): boolean | undefined => {
          const permissions = getPermissionsList();
          const roles = userLoggedData?.userData.roles || [];
          return permissions.some(
               (perm) => perm.actionName === actionName && roles.includes(perm.roleName)
          );
     };

     // Initialize session data on mount
     useEffect(() => {
          const initializeSession = async () => {
               try {
                    if (sessionStorage.getItem('authorization')) {
                         setLoggedData(getUserLoggedData());
                    }
                    setIsReady(true);
               } catch (error) {
                    console.error('Error initializing session:', error);
               }
          };

          initializeSession();
     }, []);

     const getToken = () => {
          const authData = sessionStorage.getItem('authorization');
          const userDataToken = JSON.parse(decrypt(authData!)) as unknown as UserDataToken
          return userDataToken.token
     }

     // Provide context value
     const contextValue = useMemo(
          () => ({
               isReady,
               getToken,
               userLoggedData,
               storeSessionData,
               logout,
               isAuthenticated,
               isAllowed,
               getPermissionList,
               hasAction,
          }),
          [userLoggedData, isAuthenticated]
     );

     return (
          <AuthContext.Provider value={contextValue}>
               {isReady ? children : null}
          </AuthContext.Provider>
     );
};