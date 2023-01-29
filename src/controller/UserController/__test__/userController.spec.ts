import { Mockgoose } from 'mockgoose';
import mongoose, { Model } from 'mongoose';
import * as argon2 from 'argon2';

import { UserController } from '../userController';
import { userMocks } from './mocks';
import { userSchema } from '../../../entity/User';
import { IUser } from '../UserControllerTypes';

let mockgoose: Mockgoose = new Mockgoose(mongoose);
let db: typeof mongoose;

describe('User Controller', () => {
	const userId = userMocks.createMockUser().userId;
	const mockReq = { ...userMocks.createMockUserRequest(), userId };
	const mockResFindUsers = Array.from(
		{ length: 10 },
		userMocks.createMockUser
	);

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
		beforeEach(() => {
			jest.spyOn(argon2, 'hash').mockImplementation(() =>
				Promise.resolve('hashed-password')
			);
			userModel.prototype.save = jest
				.fn()
				.mockReturnValue({ ...userMock, password: 'hashed-password' });
		});

		it('Should encrypt user password', async () => {
			let res = await userController.createUser();
			expect(res.user?.password).toEqual('hashed-password');
		});

		it('Should create an user', async () => {
			let res = await userController.createUser();
			expect(res).toEqual({
				message: 'User creado exitosamente',
				user: { ...userMock, password: 'hashed-password' },
				status: 200,
			});
		});
		it('Should catch error while creating an user', async () => {
			userModel.prototype.save = jest
				.fn()
				.mockRejectedValueOnce({ error: 'error' });
			const res = await userController.createUser();
			expect(res).toEqual({
				message: 'Error al crear el usuario',
				status: 500,
			});
		});
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
		beforeEach(() => {
			userModel.findById = jest.fn().mockReturnValue({
				populate: jest.fn().mockReturnValue({
					exec: jest.fn().mockResolvedValue(userMock),
				}),
			});
		});
		it('Should return a user', async () => {
			const res = await userController.fetchUser();
			expect(res).toEqual({
				message: 'Usuario obtenido exitosamente',
				user: userMock,
				status: 200,
			});
		});
		it('Should catch error if it fails', async () => {
			userModel.findById = jest
				.fn()
				.mockRejectedValueOnce({ error: 'error' });
			const res = await userController.fetchUser();
			expect(res).toEqual({
				message: `Error al obtener el usuario ${userId}`,
				status: 500,
			});
		});
	});

	describe('updateUser', () => {
		it('Should return update an user', async () => {});
		it('Should catch error if it fails', async () => {});
	});
});
