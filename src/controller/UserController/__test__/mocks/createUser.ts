import { User } from '../../../../entity/User';
import { faker } from '@faker-js/faker';

export const createMockUser = () => {
	return new User({
		userName: faker.internet.userName(),
		name: faker.name.findName(),
		password: faker.internet.password(),
		roleId: faker.datatype.uuid(),
		userId: faker.datatype.uuid(),
		createdAt: faker.date.past(),
		updateAt: faker.date.recent(),
	});
};
