import mongoose from 'mongoose';
import { userSchema } from '../../entity/User';
import { CreateUserRequest, IUser } from './UserControllerTypes';

export class UserController {
	private userProps: CreateUserRequest;
	private db: typeof mongoose;
	private userModel;
	constructor(userProps: CreateUserRequest, db: typeof mongoose) {
		this.userProps = userProps;
		this.userModel = db.model<IUser, mongoose.Model<IUser>>(
			'User',
			userSchema
		);
	}

	/**
	 * fetchUsers
	 */
	public async fetchUsers() {
		let users;
		try {
			users = await this.userModel.find();
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
			user = new this.userModel(this.userProps);
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
