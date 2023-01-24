import {  User } from '../../entity/User';
import { CreateUserRequest } from './UserControllerTypes';

export class UserController {
	private userProps: CreateUserRequest;
	constructor(userProps: CreateUserRequest) {
		this.userProps = userProps;
	}

	/**
	 * fetchUsers
	 */
	public async fetchUsers() {
		let users
		try {
			users = await User.find()
		} catch (error) {
			return { status: 500, message: 'Error al obtener los usuarios' };
		}
		return {
			status: 200,
			message: 'Usuarios obtenidos con exitosamente',
			users,
		};
	}

	/**
	 * fetchUser
	 */
	public async fetchUser() {}

	/**
	 * createUser
	 */
	public async createUser() {
		const user = new User();
		await user.save();
	}

	/**
	 * updateUser
	 */
	public async updateUser() {}
}
