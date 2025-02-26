import { initialPermissionsByRoleState, PermissionByRoleActions } from '../types';

export const PermissionsByRoleReducer = (state = initialPermissionsByRoleState, action: PermissionByRoleActions) => {

     switch (action.type) {
          case "ADD_ROLE": {
               const addNewRole = {
                    ...state,
                    newRole: action.payload,
                    actionListSelected: [...state.actionListSelected],
                    usersByRole: [...state.usersByRole],
               };
               return addNewRole;
          }

          case "UPDATE_ROLE": {
               return {
                    ...state,
                    newRole: action.payload,
                    actionListSelected: [...state.actionListSelected],
                    usersByRole: [...state.usersByRole],
               };
          }

          // ACTION SELECTED
          case "SET_ACTIONS_SELECTED": {
               return {
                    ...state,
                    newRole: { ...state.newRole },
                    actionListSelected: action.payload,
                    usersByRole: [...state.usersByRole],
               };
          }
          // case "CLEAR_ACTIONS_SELECTED": {
          //      return {
          //           ...state,
          //           rolesPermissions: {
          //                ...state.rolesPermissions,
          //                actionListSelected: [],
          //           },
          //      };
          // }
          // case "GET_ACTIONS_SELECTED": {
          //      return {
          //           ...state,
          //           rolesPermissions: {
          //                ...state.rolesPermissions,
          //                actionListSelected: [...state.rolesPermissions.actionListSelected],
          //           },
          //      };
          // }

          // // USERS
          // case "SET_USERS_SELECTED": {
          //      return {
          //           ...state,
          //           rolesPermissions: {
          //                ...state.rolesPermissions,
          //                usersByRole: action.payload,
          //           },
          //      };
          // }
          // case "CLEAR_USERS_SELECTED": {
          //      return {
          //           ...state,
          //           rolesPermissions: {
          //                ...state.rolesPermissions,
          //                usersByRole: [],
          //           },
          //      };
          // }
          // case "GET_USERS_SELECTED": {
          //      return {
          //           ...state,
          //           rolesPermissions: {
          //                ...state.rolesPermissions,
          //                usersByRole: [...state.rolesPermissions.usersByRole],
          //           },
          //      };
          // }

          default:
               return {
                    ...state,
                    newRole: { ...state.newRole },
                    actionListSelected: [...state.actionListSelected],
                    usersByRole: [...state.usersByRole]
               }
     }
};