import { IRole, Role } from '../../entity/Role';
import { IRoleController, RoleRequest } from './RoleControllerTypes';

export class RoleController implements IRoleController {
	private roleProps: RoleRequest;
	constructor(roleProps: RoleRequest) {
		this.roleProps = roleProps;
	}

	/**
	 * fetchUsers
	 */
	public async fetchRoles() {
		let roles;
		try {
			roles = await Role.find();
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
		let role: IRole | null;
		try {
			role = await Role.findById(this.roleProps?.roleId);
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
			role = new Role(this.roleProps);
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
		let role: IRole | null;
		try {
			role = await Role.findOneAndUpdate(
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
