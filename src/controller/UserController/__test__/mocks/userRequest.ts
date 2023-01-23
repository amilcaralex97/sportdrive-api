import { CreateUserRequest } from '../../UserControllerTypes';
const faker = require('@faker-js/faker');
const { v4: uuidv4 } = require('uuid');

export const createMockUserRequest = (): CreateUserRequest => {
	return {
		userName: faker.internet.userName(),
		name: faker.name.findName(),
		password: faker.internet.password(),
		roleId: uuidv4(),
		userId: uuidv4(),
	};
};
