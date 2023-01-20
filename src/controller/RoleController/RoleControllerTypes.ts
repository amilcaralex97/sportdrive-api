import { IRole } from '../../entity/Role';

export type RoleRequest = {
	userAccess?: number;
	receiptAccess?: number;
	userId?: string;
	roleId?: string;
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
