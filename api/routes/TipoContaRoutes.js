import express from 'express';
import { insert, update, exclude, close, reopen, getById } from '../db/TipoConta.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
    try {
        const tipoConta = req.body;
        const data = await insert(tipoConta);
        res.send(data);
        logger.info(`POST /tipoConta - ${JSON.stringify(data)}`);
    } catch (err) {
        next(err);
    }
});

router.put('/', async (req, res, next) => {
    try {
        const tipoConta = req.body;
        const data = await update(tipoConta);
        res.send(data);
        logger.info(`PUT /tipoConta - ${JSON.stringify(data)}`);
    } catch (err) {
        next(err);
    }
});

router.put('/close', async (req, res, next) => {
    try {
        const tipoConta = req.body;
        const data = await close(tipoConta);
        res.send(data);
        logger.info(`PUT /tipoConta/close - ${JSON.stringify(data)}`);
    } catch (err) {
        next(err);
    }
});

router.put('/reopen/:id', async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const data = await reopen(id);
        res.send(data);
        logger.info(`PUT /tipoConta/reopen/${id}`);
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        await exclude(id);
        res.send({ result: 'Ok' });
        logger.info(`DELETE /tipoConta/${id}`);
    } catch (err) {
        next(err);
    }
});

// :id é opcional
router.get('/:id?', async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const tipos = await getById(id);

        res.send(tipos);

        if (!isNaN(id)) {
            logger.info(`GET /tipoConta/${id}`);
            return;
        }

        logger.info(`GET /tipoConta/`);
    } catch (err) {
        next(err);
    }
});

router.use((err, req, res) => {
    logger.error(`${req.method} ${req.originalUrl} - ${err.message.trim()}`);
    res.status(400).send({ error: 1, message: err.message.trim() });
});

export default router;
