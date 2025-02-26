import React, { createContext, useEffect, useMemo, useState } from 'react';
import { PermissionsByRole, UserDataToken } from '../types';
import { decrypt, encrypt } from '../utils/EncryptDecryptManager';

// type PermissionsByRole = {
//      resourseName: string;
//      roleName: string;
//      actionName: string;
// };

type Props = { children: React.ReactNode };

type AuthContextType = {
     isReady: boolean
     getToken(): string
     userLoggedData: UserDataToken | null;
     storeSessionData: (userDataToken: UserDataToken, permissionsByRole: PermissionsByRole[]) => void;
     logout: () => void;
     isAuthenticated: () => boolean;
     isAllowed: (resource: string) => boolean;
     getPermissionList: (resource: string) => PermissionsByRole[];
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

     const getPermissionsList = (): PermissionsByRole[] => {
          try {
               const permissionsData = sessionStorage.getItem('permissionsByRole');
               return permissionsData ? JSON.parse(decrypt(permissionsData)) : [];
          } catch (error) {
               console.error('Error retrieving permissions by role:', error);
               return [];
          }
     };

     // Context methods
     const storeSessionData = (userDataToken: UserDataToken, permissionsByRole: PermissionsByRole[]) => {
          try {
               sessionStorage.setItem('authorization', encrypt(JSON.stringify(userDataToken)));
               sessionStorage.setItem('permissionsByRole', encrypt(JSON.stringify(permissionsByRole)));
               setLoggedData(userDataToken);
               setIsReady(true);
          } catch (error) {
               console.error('Error storing session data:', error);
          }
     };

     const logout = () => {
          try {
               sessionStorage.removeItem('authorization');
               sessionStorage.removeItem('permissionsByRole');
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
          const permissionsByRole = getPermissionList(resource);
          return !!permissionsByRole.find((perm) => perm.resourseName === resource);
     };

     const getPermissionList = (resource: string): PermissionsByRole[] => {
          const permissionsByRole = getPermissionsList();
          const roles = userLoggedData?.userData.roles || [];
          return permissionsByRole.filter(
               (perm) => perm.resourseName === resource && roles.includes(perm.roleName)
          );
     };

     const hasAction = (actionName: string): boolean | undefined => {
          const permissionsByRole = getPermissionsList();
          const roles = userLoggedData?.userData.roles || [];
          return permissionsByRole.some(
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
               hasAction
          }),
          [userLoggedData, isAuthenticated]
     );

     return (
          <AuthContext.Provider value={contextValue}>
               {isReady ? children : null}
          </AuthContext.Provider>
     );
};