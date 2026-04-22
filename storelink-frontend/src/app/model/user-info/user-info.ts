export interface UserInfo {
  id: number;
  email: string;
  password?: string;
  enabled: boolean;
  allRoles: RoleDetails[];
}

export interface RoleDetails {
  roleId: number;
  roleName: string;
}