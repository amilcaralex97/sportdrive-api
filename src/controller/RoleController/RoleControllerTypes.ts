import { IRole } from '../../entity/Role';

export type CreateRoleRequest = {
	userName: string;
	password: string;
};

export type RoleDTO = {
	status: number;
	message: string;
	roles?: IRole[];
	role?: IRole;
	roleId?: string;
};

export interface IRoleController {
	fetchRoles: () => Promise<RoleDTO>;
	fetchRole: () => Promise<RoleDTO>;
	createRole: () => Promise<RoleDTO>;
	updateRole: () => Promise<RoleDTO>;
}
