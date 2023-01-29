import mongoose from 'mongoose';
import { IRole, roleSchema } from '../../entity/Role';
import { IRoleController, RoleRequest } from './RoleControllerTypes';

export class RoleController implements IRoleController {
	private roleProps: RoleRequest;
	private roleModel;
	constructor(roleProps: RoleRequest, db: typeof mongoose) {
		this.roleProps = roleProps;
		this.roleModel = db.model<IRole, mongoose.Model<IRole>>(
			'Role',
			roleSchema
		);
	}

	/**
	 * fetchUsers
	 */
	public async fetchRoles() {
		let roles;
		try {
			roles = await this.roleModel.find();
		} catch (error) {
			return { status: 500, message: 'Error al obtener los roles' };
		}
		return {
			status: 200,
			message: 'Roles obtenidos con exitosamente',
			roles,
		};
	}

	/**
	 * fetchRole
	 */
	public async fetchRole() {
		let role;
		try {
			role = await this.roleModel.findById(this.roleProps?.roleId);
		} catch (error) {
			return {
				status: 500,
				message: `Error al obtener rol ${this.roleProps.roleId || ''}`,
			};
		}

		if (role) {
			return {
				status: 200,
				message: 'Rol obtenido exitosamente',
				role,
			};
		}

		return {
			status: 400,
			message: `Error al obtener rol ${this.roleProps.roleId || ''}`,
		};
	}

	/**
	 * createUser
	 */
	public async createRole() {
		let role;
		try {
			role = new this.roleModel(this.roleProps);
			role = await role.save();
		} catch (error) {
			return {
				status: 500,
				message: 'Error al crear rol',
			};
		}

		return {
			status: 200,
			message: 'Rol creado exitosamente',
			role,
		};
	}

	/**
	 * updateRole
	 */
	public async updateRole() {
		let role;
		try {
			role = await this.roleModel.findOneAndUpdate(
				{ roleId: this.roleProps.roleId },
				{ $set: this.roleProps },
				{ new: true }
			);
		} catch (error) {
			return {
				status: 500,
				message: 'Error al actualizar rol',
			};
		}

		if (role) {
			return {
				status: 200,
				message: 'Rol actualizado exitosamente',
				role,
			};
		}
		return {
			status: 400,
			message: `Error al obtener rol ${this.roleProps.roleId || ''}`,
		};
	}
}
