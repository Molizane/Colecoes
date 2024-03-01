import express from 'express';
import { insert, update, exclude, getById } from '../db/Conta.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
    try {
        logger.info(`POST /conta - ${req.body}`);
        const result = await insert(req.body);
        res.send(result);
        logger.info(`POST /conta - ${JSON.stringify(result)}`);
    } catch (err) {
        next(err);
    }
});

router.put('/', async (req, res, next) => {
    try {
        logger.info(`PUT /conta - ${req.body}`);
        const result = await update(req.body);
        res.send(result);
        logger.info(`PUT /conta - ${JSON.stringify(result)}`);
    } catch (err) {
        next(err);
    }
});

router.delete('/:id?', async (req, res, next) => {
    try {
        logger.info(`DELETE /conta/${req.params.id}`);
        const result = await exclude(req.params.id);
        res.send(result);
        logger.info(`DELETE /conta/${req.params.id} - ${JSON.stringify(result)}`);
    } catch (err) {
        next(err);
    }
});

// :id é opcional
router.get('/:id?', async (req, res, next) => {
    try {
        const result = await getById(req.params.id);
        res.send(result);

        if (!isNaN(req.params.id)) {
            logger.info(`GET /conta/${req.params.id} `);
            return;
        }

        logger.info('GET /conta/');
    } catch (err) {
        next(err);
    }
});

router.use((err, req, res) => {
    logger.error(`${req.method} ${req.originalUrl} - ${err.message.trim()} `);
    res.status(400).send({ error: 1, message: err.message.trim() });
});

export default router;
