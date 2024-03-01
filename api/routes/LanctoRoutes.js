import express from 'express';
import { insert, update, exclude, getById } from '../db/Lancto.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
    try {
        logger.info(`POST /lancto - ${req.body}`);
        const result = await insert(req.body);
        res.send(result);
        logger.info(`POST /lancto - ${JSON.stringify(result)}`);
    } catch (err) {
        next(err);
    }
});

router.put('/', async (req, res, next) => {
    try {
        logger.info(`PUT /lancto - ${req.body}`);
        const result = await update(req.body);
        res.send(result);
        logger.info(`PUT /lancto - ${JSON.stringify(result)}`);
    } catch (err) {
        next(err);
    }
});

router.put('/close', async (req, res, next) => {
    try {
        logger.info(`PUT /lancto/close - ${req.body}`);
        const result = await close(req.body);
        res.send(result);
        logger.info(`PUT /lancto/close - ${JSON.stringify(result)}`);
    } catch (err) {
        next(err);
    }
});

router.put('/reopen/:id', async (req, res, next) => {
    try {
        logger.info(`PUT /lancto/reopen/${req.params.id}`);
        const result = await reopen(req.params.id);
        res.send(result);
        logger.info(`PUT /lancto/reopen/${req.params.id} - ${JSON.stringify(result)}`);
    } catch (err) {
        next(err);
    }
});

router.delete('/:id?', async (req, res, next) => {
    try {
        logger.info(`DELETE /lancto/${req.params.id}`);
        const result = await exclude(req.params.id);
        res.send(result);
        logger.info(`DELETE /lancto/${req.params.id} - ${JSON.stringify(result)}`);
    } catch (err) {
        next(err);
    }
});

// :id é opcional
router.get('/:id?', async (req, res, next) => {
    try {
        const result = await getById(req.params.id);
        res.send(result);

        if (!isNaN(id)) {
            logger.info(`GET /lancto/${id} `);
            return;
        }

        logger.info('GET /lancto/');
    } catch (err) {
        next(err);
    }
});

router.use((err, req, res) => {
    logger.error(`${req.method} ${req.originalUrl} - ${err.message.trim()} `);
    res.status(400).send({ error: 1, message: err.message.trim() });
});

export default router;
