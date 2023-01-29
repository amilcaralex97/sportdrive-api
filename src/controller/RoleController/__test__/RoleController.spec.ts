import { Mockgoose } from 'mockgoose';
import mongoose, { Model } from 'mongoose';

import { IRole, roleSchema } from '../../../entity/Role';
import { RoleController } from '../RoleController';
import { roleMocks } from './mocks';

let mockgoose: Mockgoose = new Mockgoose(mongoose);
let db: typeof mongoose;
describe('RoleController', () => {
	const mockReq = roleMocks.createRandomRoleReq();
	const mockResFind = Array.from({ length: 10 }, roleMocks.createRandomRole);
	let roleId = roleMocks.createRandomRole().roleId;
	const roleMock = {
		receiptAccess: mockReq.receiptAccess,
		userAccess: mockReq.userAccess,
		users: [mockReq.userId],
		roleId,
	};

	let roleController: RoleController;
	let roleModel: Model<IRole>;

	beforeAll(async () => {
		await mockgoose.prepareStorage();
		db = await mongoose.connect('mongodb://foobar/baz', {
			serverSelectionTimeoutMS: 5000,
		});
		roleModel = db.model<IRole, mongoose.Model<IRole>>('Role', roleSchema);
		roleController = new RoleController(mockReq, db);
	});

	afterEach(() => {
		jest.clearAllMocks();
		jest.resetAllMocks();
	});

	afterAll(async () => {
		await mongoose.connection.close();
		await mockgoose.shutdown();
	});
	describe('createRole', () => {
		beforeEach(() => {
			roleModel.prototype.save = jest.fn().mockReturnValue({});
		});
		it('Should Create Role successfully', async () => {
			roleModel.prototype.save = jest.fn().mockReturnValue(roleMock);
			let role = await roleController.createRole();
			expect(role).toEqual({
				message: 'Rol creado exitosamente',
				role: roleMock,
				status: 200,
			});
		});
		it('Should return an error > 400 when there is an error', async () => {
			roleModel.prototype.save = jest
				.fn()
				.mockRejectedValueOnce(roleMock);

			let role = await roleController.createRole();
			expect(role).toEqual({
				message: 'Error al crear rol',
				status: 500,
			});
		});
	});

	describe('fetchRoles', () => {
		beforeEach(() => {
			roleModel.find = jest.fn().mockReturnValue([...mockResFind]);
		});
		it('Should return all roles', async () => {
			const res = await roleController.fetchRoles();
			expect(res).toEqual({
				message: 'Roles obtenidos con exitosamente',
				roles: mockResFind,
				status: 200,
			});
		});
		it('Should return an error > 400 when there is an error', async () => {
			roleModel.find = jest
				.fn()
				.mockRejectedValueOnce({ error: 'error' });

			const res = await roleController.fetchRoles();
			expect(res).toEqual({
				message: 'Error al obtener los roles',
				status: 500,
			});
		});
	});

	describe('fetchRole', () => {
		beforeEach(() => {
			roleModel.findById = jest
				.fn()
				.mockResolvedValue({ ...roleMock, roleId });
		});
		it('Should return a specific role', async () => {
			let fetchRoleRequest = { ...mockReq, roleId };
			let role = await roleController.fetchRole();
			expect(role).toEqual({
				message: 'Rol obtenido exitosamente',
				role: roleMock,
				status: 200,
			});
		});
		it('Should return an error > 400 when there is an error', async () => {
			roleModel.findById = jest
				.fn()
				.mockRejectedValueOnce({ error: 'error' });
			const res = await roleController.fetchRole();
			expect(res).toEqual({
				status: 500,
				message: `Error al obtener el rol ${roleId}`,
			});
		});
	});

	describe('updateRole', () => {
		beforeEach(() => {
			roleModel.findOneAndUpdate = jest
				.fn()
				.mockResolvedValue({ ...roleMock, roleId });
		});
		it('Should update a role', async () => {
			let updateRoleRequest = { ...mockReq, roleId };

			let role = await roleController.updateRole();
			expect(role).toEqual({
				message: 'Rol actualizado exitosamente',
				role: roleMock,
				status: 200,
			});
		});
		it('Should return an error when a role is not created', async () => {
			roleModel.findOneAndUpdate = jest
				.fn()
				.mockRejectedValueOnce({ error: 'error' });
			const res = await roleController.updateRole();
			expect(res).toEqual({
				status: 500,
				message: 'Error al actualizar rol',
			});
		});
	});
});
