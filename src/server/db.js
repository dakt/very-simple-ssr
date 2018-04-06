import faker from 'faker';


function generateFakeData(count) {
    const data = [];

    for (let i = 0; i < count; i += 1) {
        data.push({
            id: i.toString(),
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            avatar: faker.image.avatar(),
            country: faker.address.country(),
            city: faker.address.city(),
            memberSince: faker.date.past(),
            aboutMe: faker.lorem.paragraph(),
        });
    }

    return data;
}

let FAKE_DATA = generateFakeData(200);

const getOne = id => (
    FAKE_DATA.find(data => data.id === id)
);

const getMany = (page, limit) => (
    FAKE_DATA.slice((page - 1) * limit, page * limit)
);

const getTotal = () => (
    FAKE_DATA.length
);

const deleteOne = (id) => {
    FAKE_DATA = FAKE_DATA.filter(data => data.id !== id);
    return id;
};

export default {
    user: {
        getOne,
        getMany,
        getTotal,
        deleteOne,
    },
};
