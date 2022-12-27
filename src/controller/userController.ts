import { User } from '../entity/User';

export class UserController {
	/**
	 * fetchUsers
	 */
	public async fetchUsers() {}

	/**
	 * createUser
	 */
	public async createUser() {
		const user = new User();
		return user;
	}
}
