import { IRole, Role } from '../../entity/Role';

export class RoleController {
	private roleProps: IRole;
	constructor(roleProps: IRole) {
		this.roleProps = roleProps;
	}

	/**
	 * fetchUsers
	 */
	public async fetchRoles() {}

	/**
	 * fetchRole
	 */
	public fetchRole() {}

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
