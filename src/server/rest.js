import express from 'express';

import db from './db';


const dataResponse = (response, data, message = 'OK') => {
    response
        .status(200)
        .send({ message, data });
};

const errorResponse = (response, error) => {
    response
        .status(500)
        .send({
            message: 'SERVER_ERROR',
            error: error && error.toString(),
        });
};

const getOne = async (req, res) => {
    try {
        const { id } = req.params;
        const data = db.user.getOne(id);

        if (data) {
            dataResponse(res, data);
        } else {
            res.status(404);
        }
    } catch (error) {
        errorResponse(res, error);
    }
};

const getMany = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const data = db.user.getMany(page, limit);
        const totalCount = db.user.getTotal();

        res.setHeader('x-total-count', totalCount);
        res.setHeader('x-page', page);
        res.setHeader('x-limit', limit);

        dataResponse(res, data);
    } catch (error) {
        errorResponse(res, error);
    }
};

const deleteOne = async (req, res) => {
    try {
        const { id } = req.params;
        db.user.deleteOne(id);
        dataResponse(res, null, 'RESOURCE_DELETED');
    } catch (error) {
        errorResponse(res, error);
    }
};

const router = express.Router();

router.route('/api/users')
    .get(getMany);

router.route('/api/users/:id')
    .get(getOne)
    .delete(deleteOne);


export default router;
