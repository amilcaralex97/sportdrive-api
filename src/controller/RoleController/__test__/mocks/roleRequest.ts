import { RoleRequest } from '../../RoleControllerTypes';
import { faker } from '@faker-js/faker';

export default function createRandomRoleReq(): RoleRequest {
	return {
		userAccess: faker.datatype.number({ min: 0, max: 8 }),
		receiptAccess: faker.datatype.number({ min: 0, max: 8 }),
		roleId: faker.datatype.uuid(),
		userId: faker.datatype.uuid(),
	};
}
