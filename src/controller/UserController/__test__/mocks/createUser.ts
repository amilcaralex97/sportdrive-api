import { User } from '../../../../entity/User';
import { faker } from '@faker-js/faker';
import createRandomRole from '../../../RoleController/__test__/mocks/createRole';

export const createMockUser = () => {
	return new User({
		userName: faker.internet.userName(),
		name: faker.name.fullName(),
		password: faker.internet.password(),
		roleId: createRandomRole(),
		userId: faker.datatype.uuid(),
		createdAt: faker.date.past(),
		updateAt: faker.date.recent(),
	});
};
