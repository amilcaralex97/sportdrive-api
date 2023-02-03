import { Mockgoose } from 'mockgoose';
import mongoose from 'mongoose';

import { AuthInteractor } from '../AuthInteractor';
import { authMocks } from './mocks';
import { UserController } from '../../../controller/UserController/userController';

let mockgoose: Mockgoose = new Mockgoose(mongoose);
let db: typeof mongoose;

let mockFetchUserByUsername = jest.fn().mockResolvedValue({
	user: { userId: 'user1', password: 'hashedpassword1' },
});

let mockVerify = jest.fn().mockResolvedValue(true);
let mockSign = jest.fn().mockResolvedValue('jwt_token');

jest.mock('../../../controller/UserController/userController', () => {
	return {
		UserController: jest.fn().mockImplementation(() => {
			return {
				fetchUserByUsername: mockFetchUserByUsername,
			};
		}),
	};
});

jest.mock('argon2', () => {
	return {
		verify: mockVerify,
	};
});

jest.mock('jsonwebtoken', () => {
	return {
		sign: mockSign,
	};
});

describe('AuthInteractor', () => {
	let authInteractor: AuthInteractor;
	const event = authMocks.mockAPIGatewayEvent({
		body: '{"userName":"test1", "password":"test1"}',
	});

	beforeAll(async () => {
		await mockgoose.prepareStorage();
		db = await mongoose.connect('mongodb://foobar/baz', {
			serverSelectionTimeoutMS: 5000,
		});
		authInteractor = new AuthInteractor(event, db);
	});

	afterEach(() => {
		jest.clearAllMocks();
		jest.resetAllMocks();
	});

	afterAll(async () => {
		await mongoose.connection.close();
		await mockgoose.shutdown();
	});

	describe('signIn', () => {
		it('should return a jwt token and a userId when sign in successfully', async () => {
			const result = await authInteractor.signIn();
			expect(result).toEqual({
				token: 'jwt_token',
				userId: 'user1',
				status: 200,
				message: 'Login exitoso',
			});
		});
		it('should return 401 when password is invalid', async () => {
			const result = await authInteractor.signIn();
			expect(result).toEqual({
				status: 401,
				message: 'Contraseña o Usuario Inválidos',
			});
		});

		it('should return 500 when fetching user fails', async () => {
			const result = await authInteractor.signIn();
			expect(result).toEqual({ status: 500, message: 'Error en login' });
		});

		it('should return 500 when the body is not provided', async () => {
			event.body = null;
			const result = await authInteractor.signIn();
			expect(result).toEqual({ status: 500, message: 'Error en login' });
		});
	});
});
