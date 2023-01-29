import { Mockgoose } from 'mockgoose';
import mongoose, { Model } from 'mongoose';

import { UserController } from '../userController';
import { userMocks } from './mocks';
import { userSchema } from '../../../entity/User';
import { IUser } from '../UserControllerTypes';

let mockgoose: Mockgoose = new Mockgoose(mongoose);
let db: typeof mongoose;

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
	let userModel: Model<IUser>;

	beforeAll(async () => {
		await mockgoose.prepareStorage();
		db = await mongoose.connect('mongodb://foobar/baz', {
			serverSelectionTimeoutMS: 5000,
		});
		userModel = db.model<IUser, mongoose.Model<IUser>>('User', userSchema);
		userController = new UserController(mockReq, db);
	});

	afterEach(() => {
		jest.clearAllMocks();
		jest.resetAllMocks();
	});

	afterAll(async () => {
		await mongoose.connection.close();
		await mockgoose.shutdown();
	});
	describe('createUser', () => {
		it('Should create an user', async () => {});
		it('Should catch error while creating an user', async () => {});
	});

	describe('fetchUsers', () => {
		beforeEach(() => {
			userModel.find = jest.fn().mockReturnValue({
				populate: jest.fn().mockReturnValue({
					exec: jest.fn().mockResolvedValue(mockResFindUsers),
				}),
			});
		});
		it('Should return all users', async () => {
			const res = await userController.fetchUsers();
			console.log(mockResFindUsers);
			expect(res).toEqual({
				message: 'Usuarios obtenidos con exitosamente',
				users: mockResFindUsers,
				status: 200,
			});
		});
		it('Should catch error if it fails', async () => {
			userModel.find = jest
				.fn()
				.mockRejectedValueOnce({ error: 'error' });
			const res = await userController.fetchUsers();
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
