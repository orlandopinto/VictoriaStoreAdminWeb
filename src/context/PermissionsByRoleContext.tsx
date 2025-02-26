import { createContext, useContext, useReducer } from 'react';
import { PermissionsByRoleReducer } from '../reducers/PermissionsByRoleReducer';
import { initialPermissionsByRoleState, PermissionByRoleActions, PermissionsByRoleState } from '../types';

interface ActionsSelectedState {
     state: PermissionsByRoleState;
     dispatch: React.Dispatch<PermissionByRoleActions>;
}

const PermissionsByRoleContext = createContext<ActionsSelectedState>({} as ActionsSelectedState);

export const PermissionsByRoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

     const [state, dispatch] = useReducer(PermissionsByRoleReducer, initialPermissionsByRoleState);

     return (
          <PermissionsByRoleContext.Provider value={{ state, dispatch }}>
               {children}
          </PermissionsByRoleContext.Provider>
     );
};

export const usePermissionsByRoleContext = () => {
     const context = useContext(PermissionsByRoleContext);
     if (!context) {
          throw new Error('useActionsSelectedContext must be used within an ActionsSelectedProvider');
     }
     return context;
};