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
		jest.resetAllMocks();
	});
	describe('createRole', () => {
		beforeEach(() => {
			Role.prototype.save = jest.fn().mockReturnValue({});
		});
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
		beforeEach(() => {
			Role.find = jest.fn().mockReturnValue([...mockResFind]);
		});
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
		beforeEach(() => {
			Role.findById = jest
				.fn()
				.mockResolvedValue({ ...roleMock, roleId });
		});
		it('Should return a specific role', async () => {
			let fetchRoleRequest = { ...mockReq, roleId };

			let roleController = new RoleController(fetchRoleRequest);
			let role = await roleController.fetchRole();
			expect(role).toEqual({
				message: 'Rol obtenido exitosamente',
				role: roleMock,
				status: 200,
			});
		});
		it('Should return an error > 400 when there is an error', async () => {
			Role.findById = jest.fn().mockRejectedValueOnce({ error: 'error' });
			const roles = new RoleController({});
			const res = await roles.fetchRole();
			expect(res).toEqual({
				status: 500,
				message: 'Error al obtener rol ',
			});
		});
	});

	describe('updateRole', () => {
		beforeEach(() => {
			Role.findOneAndUpdate = jest
				.fn()
				.mockResolvedValue({ ...roleMock, roleId });
		});
		it('Should update a role', async () => {
			let updateRoleRequest = { ...mockReq, roleId };

			let roleController = new RoleController(updateRoleRequest);
			let role = await roleController.updateRole();
			expect(role).toEqual({
				message: 'Rol actualizado exitosamente',
				role: roleMock,
				status: 200,
			});
		});
		it('Should return an error when a role is not created', async () => {
			Role.findOneAndUpdate = jest
				.fn()
				.mockRejectedValueOnce({ error: 'error' });
			const roles = new RoleController({});
			const res = await roles.updateRole();
			expect(res).toEqual({
				status: 500,
				message: 'Error al actualizar rol',
			});
		});
	});
});
