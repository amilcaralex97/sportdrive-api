import { IRole, Role } from '../../entity/Role';
import { IRoleController } from './RoleControllerTypes';

export class RoleController implements IRoleController {
	private roleProps: IRole;
	constructor(roleProps: IRole) {
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
		let role;
		try {
			role = await Role.findById(this.roleProps.roleId).exec();
		} catch (error) {
			return {
				status: 500,
				message: `Error al obtener rol ${this.roleProps.roleId || ''}`,
			};
		}
		return {
			status: 200,
			message: 'Roles obtenido exitosamente',
		};
	}

	/**
	 * createUser
	 */
	public async createRole() {
		let role;
		try {
			role = new Role(this.roleProps);
			await role.save();
		} catch (error) {
			throw new Error('Error while trying to create role');
		}

		return role;
	}
}
