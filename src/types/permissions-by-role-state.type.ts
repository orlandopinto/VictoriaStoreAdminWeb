export type NewRole = {
     id?: string,
     roleName: string,
     roleDescription?: string
}

export type ActionsSelected = {
     checked: boolean
     id: string
     actionId: string
     actionName: string
     resourseId: string
     resourseName: string
     roleId: string | null
     roleName: string | null
}

export type UsersByRole = {
     email: string,
     firstName: string,
     lastName: string,
     imageProfilePath?: string
}

export type PermissionByRoleActions =

     | { type: 'ADD_ROLE'; payload: NewRole }
     | { type: 'UPDATE_ROLE'; payload: NewRole }

     // ACTION SELECTED
     | { type: "SET_ACTIONS_SELECTED"; payload: ActionsSelected[] }
     | { type: "CLEAR_ACTIONS_SELECTED" }
     | { type: "GET_ACTIONS_SELECTED" }
     // USERS
     | { type: "SET_USERS_SELECTED"; payload: UsersByRole[] }
     | { type: "CLEAR_USERS_SELECTED" }
     | { type: "GET_USERS_SELECTED" };


export interface PermissionsByRoleState {
     newRole: NewRole;
     actionListSelected: ActionsSelected[];
     usersByRole: UsersByRole[]
}

export const initialPermissionsByRoleState: PermissionsByRoleState = {
     newRole: {} as NewRole,
     actionListSelected: [],
     usersByRole: []
};