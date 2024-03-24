import express from 'express';
import { insert, update, exclude, getById, getByIdLote } from '../db/LanctoDb.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
    try {
        logger.info(`POST /lancto`); // - ${req.body}`);
        const result = await insert(req.body);

        if (result.status) {
            res.status(500).send(result);
        }
        else {
            res.send(result);
        }

        logger.info(`POST /lancto`); // - ${JSON.stringify(result)}`);
    } catch (err) {
        if (err.response && err.response.data && err.response.data.msg) {
            res.status(500).send(err.response.data);
            return;
        }

        next(err);
    }
});

router.put('/', async (req, res, next) => {
    try {
        logger.info(`PUT /lancto`); // - ${req.body}`);
        const result = await update(req.body);

        if (result.status) {
            res.status(500).send(result);
        }
        else {
            res.send(result);
        }

        logger.info(`PUT /lancto`); // - ${JSON.stringify(result)}`);
    } catch (err) {
        if (err.response && err.response.data && err.response.data.msg) {
            res.status(500).send(err.response.data);
            return;
        }

        next(err);
    }
});

router.delete('/:id?', async (req, res, next) => {
    try {
        logger.info(`DELETE /lancto/${req.params.id}`);
        const result = await exclude(req.params.id);

        if (result.status) {
            res.status(500).send(result);
        }
        else {
            res.send(result);
        }

        logger.info(`DELETE /lancto/${req.params.id} - ${JSON.stringify(result)}`);
    } catch (err) {
        if (err.response && err.response.data && err.response.data.msg) {
            res.status(500).send(err.response.data);
            return;
        }

        next(err);
    }
});

// :id é opcional
router.get('/:id?', async (req, res, next) => {
    try {
        if (!isNaN(req.params.id)) {
            logger.info(`GET /lancto/${req.params.id} `);
        }
        else {
            logger.info('GET /lancto');
        }

        const result = await getById(req.params.id);

        if (result.status) {
            res.status(500).send(result);
        }
        else {
            res.send(result);
        }
    } catch (err) {
        if (err.response && err.response.data && err.response.data.msg) {
            res.status(500).send(err.response.data);
            return;
        }

        next(err);
    }
});

router.get('/lote/:id', async (req, res, next) => {
    try {
        logger.info(`GET /lancto/lote/${req.params.id} `);

        const result = await getByIdLote(req.params.id);

        if (result.status) {
            res.status(500).send(result);
        }
        else {
            res.send(result);
        }
    } catch (err) {
        if (err.response && err.response.data && err.response.data.msg) {
            res.status(500).send(err.response.data);
            return;
        }

        next(err);
    }
});

router.put('/close', async (req, res, next) => {
    try {
        logger.info(`PUT /lancto/close`); // - ${req.body}`);
        const result = await close(req.body);

        if (result.status) {
            res.status(500).send(result);
        }
        else {
            res.send(result);
        }

        logger.info(`PUT /lancto/close - ${JSON.stringify(result)}`);
    } catch (err) {
        if (err.response && err.response.data && err.response.data.msg) {
            res.status(500).send(err.response.data);
            return;
        }

        next(err);
    }
});

router.put('/reopen/:id', async (req, res, next) => {
    try {
        logger.info(`PUT /lancto/reopen`); ///${req.params.id}`);
        const result = await reopen(req.params.id);

        if (result.status) {
            res.status(500).send(result);
        }
        else {
            res.send(result);
        }

        logger.info(`PUT /lancto/reopen/${req.params.id} - ${JSON.stringify(result)}`);
    } catch (err) {
        if (err.response && err.response.data && err.response.data.msg) {
            res.status(500).send(err.response.data);
            return;
        }

        next(err);
    }
});

//router.use((err, req, res) => {
//    logger.error(`${req.method} ${req.originalUrl} - ${err.message.trim()} `);
//    res.status(400).send({ error: 1, message: err.message.trim() });
//});

export default router;
