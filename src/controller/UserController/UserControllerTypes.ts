import { IUser } from '../../entity/User';

export type CreateUserRequest = {
	userName?: string;
	name?: string;
	password?: string;
	roleId?: string;
	userId?: string;
};

export type UserDTO = {
	status: number;
	message: string;
	roles?: IUser[];
	role?: IUser;
	userId?: string;
};

export interface IRoleController {
	fetchUsers: () => Promise<UserDTO>;
	fetchUser: () => Promise<UserDTO>;
	createUser: () => Promise<UserDTO>;
	updateUser: () => Promise<UserDTO>;
}
