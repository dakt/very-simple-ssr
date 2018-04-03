import express from 'express';
import faker from 'faker';


function generateFakeData(count) {
    const data = [];

    for (let i = 0; i < count; i += 1) {
        data.push({
            id: faker.random.uuid(),
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            avatar: faker.image.avatar(),
        });
    }

    return data;
}

let FAKE_DATA = generateFakeData(200);

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
router.get('/api/users', getMany);
router.delete('/api/users/:id', deleteOne);

export default router;
