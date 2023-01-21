import { Role } from '../../../entity/Role';
import { RoleController } from '../RoleController';
import { roleMocks } from './mocks';

describe('RoleController', () => {
	const mockReq = roleMocks.createRandomRoleReq();
	const mockResFind = [
		roleMocks.createRandomRole(),
		roleMocks.createRandomRole(),
	];
	beforeEach(() => {
		Role.find = jest.fn().mockReturnValue([...mockResFind]);
	});
	describe('createRole', () => {
		it('Should Create Role successfully', async () => {
			const role = new RoleController({});
		});
		it('Should return an error > 400 when there is an error', async () => {});
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
			Role.find = jest.fn().mockReturnValue([...mockResFind]);
			const roles = new RoleController({});
			const res = await roles.fetchRoles();
			expect(res).toEqual({
				message: 'Roles obtenidos con exitosamente',
				roles: mockResFind,
				status: 200,
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
