import { IRole } from '../../../../entity/Role';
import { faker } from '@faker-js/faker';

export default function createRandomRole(): IRole {
	return {
		userAccess: faker.datatype.number({ min: 0, max: 8 }),
		receiptAccess: faker.datatype.number({ min: 0, max: 8 }),
		roleId: faker.datatype.uuid(),
		users: [faker.datatype.uuid()],
	};
}
