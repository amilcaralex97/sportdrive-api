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
			let res = await argon2.hash('test');
			expect(res).toEqual('hashed-password');
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
			userModel.find = jest.fn().mockReturnValue({
				populate: jest.fn().mockReturnValue({
					exec: jest.fn().mockRejectedValue({ error: 'error' }),
				}),
			});
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
			userModel.findById = jest.fn().mockReturnValue({
				populate: jest.fn().mockReturnValue({
					exec: jest.fn().mockRejectedValue({ error: 'error' }),
				}),
			});
			const res = await userController.fetchUser();
			expect(res).toEqual({
				message: `Error al obtener el usuario ${userId}`,
				status: 500,
			});
		});
	});

	describe('fetchUserByUsername', () => {
		beforeEach(() => {
			userModel.findOne = jest.fn().mockReturnValue({
				populate: jest.fn().mockReturnValue({
					exec: jest.fn().mockResolvedValue(userMock),
				}),
			});
		});
		it('Should get an user by username', async () => {
			const res = await userController.fetchUserByUsername();

			expect(res).toEqual({
				message: 'Usuario obtenido exitosamente',
				status: 200,
				user: userMock,
			});
		});

		it('Should catch error if it fails', async () => {
			userModel.findOne = jest.fn().mockReturnValue({
				populate: jest.fn().mockReturnValue({
					exec: jest.fn().mockRejectedValue({ error: 'error' }),
				}),
			});
			const res = await userController.fetchUserByUsername();
			expect(res).toEqual({
				message: `Error al obtener el usuario ${mockReq.userName}`,
				status: 500,
			});
		});
	});

	describe('updateUser', () => {
		beforeEach(() => {
			userModel.findOneAndUpdate = jest
				.fn()
				.mockResolvedValue({ ...userMock, userId });
			jest.spyOn(argon2, 'hash').mockImplementation(() =>
				Promise.resolve('hashed-password')
			);
		});
		afterEach(() => {
			jest.resetAllMocks();
		});
		it('Should encrypt password if updated', async () => {
			let res = await argon2.hash('test');
			expect(res).toEqual('hashed-password');
		});
		it('Should return update an user', async () => {
			let res = await userController.updateUser();
			expect(res).toEqual({
				status: 200,
				message: 'Usuario actualizado exitosamente',
				user: res.user,
			});
		});
		it('Should catch error if it fails', async () => {
			userModel.findOneAndUpdate = jest
				.fn()
				.mockRejectedValueOnce({ error: 'error' });
			const res = await userController.updateUser();
			expect(res).toEqual({
				status: 500,
				message: 'Error al actualizar el usuario',
			});
		});
	});
});
