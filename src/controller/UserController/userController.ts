import { hash } from 'argon2';
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
				.populate('roleId')
				.exec();
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
		user = new this.userModel(this.userProps);
		try {
			user.password = await hash(user.password);
			user = await user.save();
		} catch (error) {
			return {
				status: 500,
				message: 'Error al crear el usuario',
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
	public async updateUser() {
		let user;
		try {
			if (this.userProps.password) {
				this.userProps.password = await hash(this.userProps.password);
			}
			user = await this.userModel.findOneAndUpdate(
				{ userId: this.userProps.roleId },
				{ $set: this.userProps },
				{ new: true }
			);
		} catch (error) {
			return {
				status: 500,
				message: 'Error al actualizar el usuario',
			};
		}

		if (user) {
			return {
				status: 200,
				message: 'Usuario actualizado exitosamente',
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
}
