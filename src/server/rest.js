import express from 'express';

import db from './db';


const getOne = async (req, res) => {
    try {
        const { id } = req.params;
        const responseData = db.user.getOne(id);

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
    } catch (error) {
        res
            .status(500)
            .send({
                message: 'SERVER_ERROR',
                error: error.toString(),
            });
    }
};

const getMany = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const responseData = db.user.getMany(page, limit);
        const totalCount = db.user.getTotal();

        res.setHeader('x-total-count', totalCount);
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
                error: error.toString(),
            });
    }
};

const deleteOne = async (req, res) => {
    try {
        const { id } = req.params;
        db.deleteOne(id);

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
                error: error.toString(),
            });
    }
};

const router = express.Router();
router.get('/api/users/:id', getOne);
router.get('/api/users', getMany);
router.delete('/api/users/:id', deleteOne);

export default router;
