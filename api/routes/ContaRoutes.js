import express from 'express';
import { insert, update, exclude, getById } from '../db/ContaDb.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
    try {
        logger.info(`POST /conta - ${JSON.stringify(req.body)}`);
        const result = await insert(req.body);
        res.send(result);
        logger.info(`POST /conta - ${JSON.stringify(result)}`);
    } catch (err) {
        next(err);
    }
});

router.put('/', async (req, res, next) => {
    try {
        logger.info(`PUT /conta - ${JSON.stringify(req.body)}`);
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
        if (!isNaN(req.params.id)) {
            logger.info(`GET /conta/${req.params.id} `);
        }
        else {
            logger.info('GET /conta');
        }

        const result = await getById(req.params.id);

        if (result.msg) {
            res.status(550).send(result);
        }
        else {
            res.send(result);
        }
    } catch (err) {
        next(err);
    }
});

//router.use((err, req, res) => {
//    logger.error(`${req.method} ${req.originalUrl} - ${err.message.trim()} `);
//    res.status(400).send({ error: 1, message: err.message.trim() });
//});

export default router;
