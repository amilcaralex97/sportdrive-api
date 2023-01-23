const faker = require('@faker-js/faker');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

export default createMockUserRequest = (): CreateUserRequest => {
    return {
        userName: faker.internet.userName(),
        name: faker.name.findName(),
        password: faker.internet.password(),
        roleId: uuidv4(),
        userId: uuidv4()
    };
}