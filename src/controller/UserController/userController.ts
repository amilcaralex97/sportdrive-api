import { IUser, User } from '../../entity/User';

export class UserController {
	private userProps: IUser;
	constructor(userProps: IUser) {
		this.userProps = userProps;
	}

	/**
	 * fetchUsers
	 */
	public async fetchUsers() {}

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
