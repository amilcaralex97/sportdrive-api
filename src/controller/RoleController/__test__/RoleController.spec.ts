import { Role } from '../../../entity/Role';
import { RoleController } from '../RoleController';
import { roleMocks } from './mocks';

Role.prototype.save = jest.fn();

describe('RoleController', () => {
	const mockReq = roleMocks.createRandomRoleReq();
	const mockResFind = [
		roleMocks.createRandomRole(),
		roleMocks.createRandomRole(),
	];
	let roleId = roleMocks.createRandomRole().roleId;
	const roleMock = {
		receiptAccess: mockReq.receiptAccess,
		userAccess: mockReq.userAccess,
		users: [mockReq.userId],
		roleId,
	};
	beforeEach(() => {
		Role.find = jest.fn().mockReturnValue([...mockResFind]);
		Role.prototype.save = jest.fn().mockReturnValue({});
	});
	describe('createRole', () => {
		it('Should Create Role successfully', async () => {
			Role.prototype.save = jest.fn().mockReturnValue(roleMock);
			let roleController = new RoleController(mockReq);
			let role = await roleController.createRole();
			expect(role).toEqual({
				message: 'Rol creado exitosamente',
				role: roleMock,
				status: 200,
			});
		});
		it('Should return an error > 400 when there is an error', async () => {
			Role.prototype.save = jest.fn().mockRejectedValueOnce(roleMock);
			let roleController = new RoleController(mockReq);
			let role = await roleController.createRole();
			expect(role).toEqual({
				message: 'Error al crear rol',
				status: 500,
			});
		});
	});

	describe('fetchRoles', () => {
		it('Should return all roles', async () => {
			const roles = new RoleController({});
			const res = await roles.fetchRoles();
			expect(res).toEqual({
				message: 'Roles obtenidos con exitosamente',
				roles: mockResFind,
				status: 200,
			});
		});
		it('Should return an error > 400 when there is an error', async () => {
			Role.find = jest.fn().mockRejectedValueOnce({ error: 'error' });
			const roles = new RoleController({});
			const res = await roles.fetchRoles();
			expect(res).toEqual({
				message: 'Error al obtener los roles',
				status: 500,
			});
		});
	});

	describe('fetchRole', () => {
		it('Should return a specific role', () => {});
		it('Should return an error > 400 when there is an error', async () => {});
	});

	describe('updateRole', () => {
		it('Should update a role', () => {});
		it('Should return an error when a role is not created', async () => {});
	});
});
