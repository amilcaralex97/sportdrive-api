const faker = require('@faker-js/faker');
const { v4: uuidv4 } = require('uuid');
import { Certificate } from '../../../../entity/Certificate';

export const createMockCertificateHelper = () => {
	return new Certificate({
		certificateUrl: faker.internet.url(),
		receiptId: uuidv4(),
		certificateId: uuidv4(),
		createdAt: faker.date.past(),
		updatedAt: faker.date.recent(),
	});
};
