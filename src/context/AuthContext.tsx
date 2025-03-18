import React, { createContext, useEffect, useMemo, useState } from 'react';
import { PermissionsByRole, PermissionsProfile, UserDataToken } from '../types';
import { decrypt, encrypt } from '../utils/EncryptDecryptManager';

type Props = { children: React.ReactNode };

type AuthContextType = {
     isReady: boolean
     getTokens(): [string, string]
     userLoggedData: UserDataToken | null;
     storeSessionData: (userDataToken: UserDataToken, permissionsProfile: PermissionsProfile[]) => void;
     logout: () => void;
     isAuthenticated: () => boolean;
     isAllowed: (resource: string) => boolean;
     getPermissionList: (resource: string) => PermissionsByRole[];
     hasAction: (actionName: string) => boolean | undefined;
     getPermissionsProfileStateList: () => PermissionsProfile[];
     updatePermissionsProfile: (permissionsProfile: PermissionsProfile[]) => void;
     updateTokens: (userDataToken: UserDataToken) => void
};

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: Props) => {

     const [isReady, setIsReady] = useState(false);
     const [userLoggedData, setLoggedData] = useState<UserDataToken | null>(null);

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

     const getUserLoggedData = (): UserDataToken | null => {
          try {
               const authData = sessionStorage.getItem('authorization');
               return authData ? JSON.parse(decrypt(authData)) : null;
          } catch (error) {
               console.error('Error retrieving user data:', error);
               return null;
          }
     };

     const getPermissionsProfileStateList = (): PermissionsProfile[] => {
          try {
               const permissionsData = sessionStorage.getItem('permissionsProfile') as string;
               const result = JSON.parse(decrypt(permissionsData)) as unknown as PermissionsProfile[];
               setIsReady(true);
               return result;
          } catch (error) {
               console.error('Error retrieving permissions by role:', error);
               return [];
          }
     };

     const storeSessionData = (userDataToken: UserDataToken, permissionsProfile: PermissionsProfile[]) => {
          try {
               sessionStorage.setItem('authorization', encrypt(JSON.stringify(userDataToken)));
               sessionStorage.setItem('permissionsProfile', encrypt(JSON.stringify(permissionsProfile)));
               setLoggedData(userDataToken);
               setIsReady(true);
          } catch (error) {
               console.error('Error storing session data:', error);
          }
     };

     const updateTokens = (userDataToken: UserDataToken) => {
          try {
               sessionStorage.setItem('authorization', encrypt(JSON.stringify(userDataToken)));
               setIsReady(true);
          } catch (error) {
               console.error('Error storing session data:', error);
          }
     };

     const updatePermissionsProfile = (permissionsProfile: PermissionsProfile[]) => {
          try {
               sessionStorage.setItem('permissionsProfile', encrypt(JSON.stringify(permissionsProfile)));
               setIsReady(true);
          } catch (error) {
               console.error('Error storing session data:', error);
          }
     };

     const logout = () => {
          try {
               sessionStorage.removeItem('authorization');
               sessionStorage.removeItem('permissionsProfile');
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
          return getPermissionList(resource).some(perm => perm.pageName === resource);
     };

     const getPermissionList = (resource: string): PermissionsByRole[] => {
          const roles = userLoggedData?.userData.roles || [];
          return getPermissionsProfileStateList()
               .flatMap(perms => perms.permissionsByRole)
               .filter(perm => perm.pageName === resource && roles.includes(perm.roleName!));
     };

     const hasAction = (actionName: string): boolean => {
          const roles = userLoggedData?.userData.roles || [];
          return getPermissionsProfileStateList()
               .flatMap(perms => perms.permissionsByRole)
               .some(perm => perm.actionName === actionName && roles.includes(perm.roleName!));
     };

     const getTokens = (): [string, string] => {
          const tokens = getUserLoggedData();
          setIsReady(true);
          return [tokens?.accessToken || '', tokens?.refreshToken || ''];
     }

     const contextValue = useMemo(
          () => ({
               isReady,
               getTokens,
               userLoggedData,
               storeSessionData,
               logout,
               isAuthenticated,
               isAllowed,
               getPermissionList,
               hasAction,
               getPermissionsProfileStateList,
               updatePermissionsProfile,
               updateTokens
          }),
          [userLoggedData, isAuthenticated]
     );

     return (
          <AuthContext.Provider value={contextValue}>
               {isReady ? children : null}
          </AuthContext.Provider>
     );
};