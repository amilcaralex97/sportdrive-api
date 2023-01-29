import mongoose from 'mongoose';
import { userSchema } from '../../entity/User';
import { CreateUserRequest, IUser } from './UserControllerTypes';

export class UserController {
	private userProps: CreateUserRequest;
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
			users = await this.userModel.find().populate('roleId').exec();
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
	public async fetchUser() {
		let user;
		try {
			user = await this.userModel
				.findById(this.userProps.userId)
				.populate('roleId');
		} catch (error) {
			return {
				status: 500,
				message: `Error al obtener el usuario ${
					this.userProps.userId || ''
				}`,
			};
		}

		if (user) {
			return {
				status: 200,
				message: 'Usuario obtenido exitosamente',
				user,
			};
		}

		return {
			status: 400,
			message: `Error al obtener el usuario ${
				this.userProps.userId || ''
			}`,
		};
	}

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
