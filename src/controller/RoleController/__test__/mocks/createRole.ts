import { IRole, Role } from '../../../../entity/Role';
import { faker } from '@faker-js/faker';

export default function createRandomRole(): IRole {
	return new Role({
		userAccess: faker.datatype.number({ min: 0, max: 8 }),
		receiptAccess: faker.datatype.number({ min: 0, max: 8 }),
		roleId: faker.datatype.uuid(),
		users: [faker.datatype.uuid()],
		createdAt: faker.date.past(),
		updatedAt: faker.date.recent(),
	});
}
