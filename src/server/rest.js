import express from 'express';
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

const getOne = async (req, res) => {
    const { id } = req.params;
    const responseData = FAKE_DATA.find(data => data.id === id);

    if (responseData) {
        res
            .status(200)
            .send({
                message: 'OK',
                data: responseData,
            });
    } else {
        res.status(404);
    }
};

const getMany = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const responseData = FAKE_DATA.slice((page - 1) * limit, page * limit);

        res.setHeader('x-total-count', FAKE_DATA.length);
        res.setHeader('x-page', page);
        res.setHeader('x-limit', limit);

        res
            .status(200)
            .send({
                message: 'OK',
                data: responseData,
            });
    } catch (error) {
        res
            .status(500)
            .send({
                message: 'SERVER_ERROR',
            });
    }
};

const deleteOne = async (req, res) => {
    try {
        const { id } = req.params;
        FAKE_DATA = FAKE_DATA.filter(data => data.id !== id);

        res
            .status(200)
            .send({
                data: id,
                message: 'RESOURCE_DELETED',
            });
    } catch (error) {
        res
            .status(500)
            .send({
                message: 'SERVER_ERROR',
            });
    }
};

const router = express.Router();
router.get('/api/users/:id', getOne);
router.get('/api/users', getMany);
router.delete('/api/users/:id', deleteOne);

export default router;
