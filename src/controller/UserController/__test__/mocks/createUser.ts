const faker = require('@faker-js/faker');
const { v4: uuidv4 } = require('uuid');
const User = mongoose.model("User", userSchema);

export default createMockUser = () => {
    return new User({
        userName: faker.internet.userName(),
        name: faker.name.findName(),
        password: faker.internet.password(),
        roleId: uuidv4(),
        userId: uuidv4(),
        createdAt: faker.date.past(),
        updateAt: faker.date.recent()
    });
}
