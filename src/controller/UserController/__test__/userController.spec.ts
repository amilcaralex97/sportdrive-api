import { UserController } from '../userController';
import { userMocks } from './mocks';
import mongoose from 'mongoose';
import { userSchema } from '../../../entity/User';

describe('User Controller', () => {
	const mockReq = userMocks.createMockUserRequest();
	const mockResFindUsers = Array.from(
		{ length: 10 },
		userMocks.createMockUser
	);
	const userId = userMocks.createMockUser().userId;
	const userMock = {
		userName: mockReq.userName,
		name: mockReq.name,
		password: mockReq.password,
		roleId: mockReq.roleId,
		userId: mockReq.userId,
	};
	let userController: UserController;
	let db: typeof mongoose;
	let userModel;

	beforeEach(() => {
		db = mongoose;
		userModel = db.model('User', new mongoose.Schema(userSchema));
		userController = new UserController({}, db);
		jest.resetAllMocks();
	});
	describe('createUser', () => {
		it('Should create an user', async () => {});
		it('Should catch error while creating an user', async () => {});
	});

	describe('fetchUsers', () => {
		it('Should return all users', async () => {
			jest.spyOn(userModel, 'find').mockImplementation(() =>
				Promise.resolve(users)
			);
			const res = await users.fetchUsers();
			expect(res).toEqual({
				message: 'Usuarios obtenidos con exitosamente',
				users: mockResFindUsers,
				status: 200,
			});
		});
		it('Should catch error if it fails', async () => {
			User.find = jest.fn().mockRejectedValueOnce({ error: 'error' });
			const users = new UserController({});
			const res = await users.fetchUsers();
			expect(res).toEqual({
				message: 'Error al obtener los usuarios',
				status: 500,
			});
		});
	});

	describe('fetchUser', () => {
		it('Should return a users', async () => {});
		it('Should catch error if it fails', async () => {});
	});

	describe('updateUser', () => {
		it('Should return update an user', async () => {});
		it('Should catch error if it fails', async () => {});
	});
});
