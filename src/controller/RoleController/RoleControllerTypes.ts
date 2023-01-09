export type CreateRoleRequest = {
	userName: string;
	password: string;
};

export type RoleDTO = {
	status: number;
	message: string;
	token?: string;
	userId?: string;
};

export interface IRoleController {
	fetchRoles: () => Promise<RoleDTO>;
	fetchRole: () => Promise<RoleDTO>;
	createRole: () => Promise<RoleDTO>;
}
