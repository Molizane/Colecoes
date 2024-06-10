import express from "express";

import {
  insert,
  update,
  exclude,
  getById,
  getByType,
} from "../db/TipoContaDb.js";

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    logger.info(`POST /tipoConta`); // - ${JSON.stringify(req.body)}`);
    const result = await insert(req.body);

    if (result.status) {
      res.status(500).send(result);
    } else {
      res.send(result);
    }

    logger.info(`POST /tipoConta - ${JSON.stringify(result)}`);
  } catch (err) {
    if (err.response && err.response.data && err.response.data.msg) {
      res.status(500).send(err.response.data);
      return;
    }

    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    logger.info(`PUT /tipoConta`); // - ${JSON.stringify(req.body)}`);
    const result = await update(req.body);

    if (result.status) {
      res.status(500).send(result);
    } else {
      res.send(result);
    }

    logger.info(`PUT /tipoConta - ${JSON.stringify(result)}`);
  } catch (err) {
    if (err.response && err.response.data && err.response.data.msg) {
      res.status(500).send(err.response.data);
      return;
    }

    next(err);
  }
});

router.delete("/:id?", async (req, res, next) => {
  try {
    logger.info(`DELETE /tipoConta/${req.params.id}`);
    const result = await exclude(req.params.id);

    if (result.status) {
      res.status(500).send(result);
    } else {
      res.send(result);
    }

    logger.info(
      `DELETE /tipoConta/${req.params.id} - ${JSON.stringify(result)}`
    );
  } catch (err) {
    if (err.response && err.response.data && err.response.data.msg) {
      res.status(500).send(err.response.data);
      return;
    }

    next(err);
  }
});

// :id é opcional
router.get("/:id?", async (req, res, next) => {
  var result;

  try {
    if (
      req.params.id === "d" ||
      req.params.id === "D" ||
      req.params.id === "c" ||
      req.params.id === "C"
    ) {
      logger.info(`GET /tipoConta/${req.params.id.toUpperCase()} `);
      result = await getByType(req.params.id.toUpperCase());
    } else {
      if (!isNaN(req.params.id)) {
        logger.info(`GET /tipoConta/${req.params.id} `);
      } else {
        logger.info("GET /tipoConta");
      }

      result = await getById(req.params.id);
    }

    if (result.status) {
      res.status(500).send(result);
    } else {
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

// router.use((err, req, res) => {
//     console.log('ERRO router');
//     console.log(err);
//     console.log(req);
//     console.log(res);
//     logger.error(`${req.method} ${req.originalUrl} - ${err.message.trim()} `);
//     res.status(500).send({ error: 1, message: err.message.trim() });
// });

export default router;
