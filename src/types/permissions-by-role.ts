export type Role = {
     _id: string | null
     roleName: string
     roleDescription: string | null
     createdAt?: Date | null
     updatedAt?: Date | null
}

export type Page = {
     _id: string
     pageName: string
}

export type Action = {
     _id: string
     actionName: string
}

export type UsersByRole = {
     email: string,
     firstName: string,
     lastName: string,
     secure_url: string | null
}

export type PermissionsByRole = {
     checked: boolean | false
     id: string
     actionId: string
     actionName: string
     pageId: string
     pageName: string
     roleId: string | null
     roleName: string | null
}

export type PermissionsByRoleDTO = {
     actionId: string
     actionName: string
     id: string
     pageId: string
     pageName: string
     roleId: string
     roleName: string
}

export type PermissionsProfile = {
     role: Role;
     permissionsByRole: PermissionsByRole[];
     usersByRole: UsersByRole[]
}