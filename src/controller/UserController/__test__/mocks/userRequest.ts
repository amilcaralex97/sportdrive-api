import { CreateUserRequest } from '../../UserControllerTypes';
import { faker } from '@faker-js/faker';

export const createMockUserRequest = (): CreateUserRequest => {
	return {
		userName: faker.internet.userName(),
		name: faker.name.fullName(),
		password: faker.internet.password(),
		roleId: faker.datatype.uuid(),
		userId: faker.datatype.uuid(),
	};
};
