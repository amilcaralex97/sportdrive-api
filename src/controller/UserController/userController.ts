import mongoose from 'mongoose';
import { User } from '../../entity/User';
import { CreateUserRequest } from './UserControllerTypes';

export class UserController {
	private userProps: CreateUserRequest;
	private db: typeof mongoose;
	constructor(userProps: CreateUserRequest, db: typeof mongoose) {
		this.userProps = userProps;
	}

	/**
	 * fetchUsers
	 */
	public async fetchUsers() {
		let users;
		try {
			users = await User.find();
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
		let user;
		try {
			user = new User(this.userProps);
			user = await user.save();
		} catch (error) {
			return {
				status: 500,
				message: 'Error al crear user',
			};
		}
		return {
			status: 200,
			message: 'User creado exitosamente',
			user,
		};
	}

	/**
	 * updateUser
	 */
	public async updateUser() {}
}
