import { create } from 'zustand';
import { PermissionsByRole, Role, UsersByRole } from '../types';

interface PermissionsProfile {
     role: Role,
     permissionsByRole: PermissionsByRole[],
     usersByRole: UsersByRole[],
}

export const usePermissionStore = create<PermissionsProfile>(() => ({
     role: {} as Role,
     permissionsByRole: [] as PermissionsByRole[],
     usersByRole: [] as UsersByRole[]
}));