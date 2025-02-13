export type UserPermissions = {
     permissions: UserPermission[];
}

export type UserPermission = {
     resourse: string;
     actions: string[];
     _id: string
}
