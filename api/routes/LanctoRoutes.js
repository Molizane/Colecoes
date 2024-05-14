import express from "express";
import {
  insert,
  update,
  exclude,
  close,
  reopen,
  getAll,
  getByIdPai,
  getByIdParcela,
  getByIdTipoConta,
  getByIdLote,
} from "../db/LanctoDb.js";

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    logger.info(`POST /lancto`); // - ${req.body}`);
    const result = await insert(req.body);

    if (result.status) {
      res.status(500).send(result);
    } else {
      res.send(result);
    }

    //logger.info(`POST /lancto`); // - ${JSON.stringify(result)}`);
  } catch (err) {
    if (err.response && err.response.data && err.response.data.msg) {
      res.status(500).send(err.response.data);
      return;
    }

    next(err);
  }
});

router.put("/", async (req, res, next) => {
  try {
    logger.info(`PUT /lancto`); // - ${req.body}`);
    const result = await update(req.body);
    console.log(req.body);

    if (result.status) {
      res.status(500).send(result);
    } else {
      res.send(result);
    }

    //logger.info(`PUT /lancto`); // - ${JSON.stringify(result)}`);
  } catch (err) {
    if (err.response && err.response.data && err.response.data.msg) {
      res.status(500).send(err.response.data);
      return;
    }

    next(err);
  }
});

router.delete("/:id/:parcela/:tipo", async (req, res, next) => {
  try {
    logger.info(
      `DELETE /lancto/${req.params.id}/${req.params.parcela}/${req.params.tipo}`
    );
    const result = await exclude(
      req.params.id,
      req.params.parcela,
      req.params.tipo
    );

    if (result.status) {
      res.status(500).send(result);
    } else {
      res.send(result);
    }

    //logger.info(`DELETE /lancto/${req.params.id}/${req.params.parcela} - ${JSON.stringify(result)}`);
  } catch (err) {
    if (err.response && err.response.data && err.response.data.msg) {
      res.status(500).send(err.response.data);
      return;
    }

    next(err);
  }
});

// :crit é opcional
router.get("/list/:crit?", async (req, res, next) => {
  try {
    if (req.params.crit) {
      logger.info(`GET /lancto/list/${req.params.crit} `);
    } else {
      logger.info("GET /lancto/list");
    }

    const result = await getAll(req.params.crit);

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

// :id é opcional
router.get("/pai/:id?", async (req, res, next) => {
  try {
    if (!isNaN(req.params.id)) {
      logger.info(`GET /lancto/${req.params.id} `);
    } else {
      logger.info("GET /lancto");
    }

    const result = await getByIdPai(req.params.id);

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

router.get("/lote/:id?", async (req, res, next) => {
  try {
    if (!isNaN(req.params.id)) {
      logger.info(`GET /lancto/lote/${req.params.id}`);
    } else {
      logger.info(`GET /lancto/lote`);
    }

    const result = await getByIdLote(req.params.id);

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

router.put("/close", async (req, res, next) => {
  try {
    logger.info(`PUT /lancto/close`); // - ${req.body}`);
    const result = await close(req.body);

    if (result.status) {
      res.status(500).send(result);
    } else {
      res.send(result);
    }

    //logger.info(`PUT /lancto/close - ${JSON.stringify(result)}`);
  } catch (err) {
    if (err.response && err.response.data && err.response.data.msg) {
      res.status(500).send(err.response.data);
      return;
    }

    next(err);
  }
});

router.put("/reopen", async (req, res, next) => {
  try {
    logger.info(`PUT /lancto/reopen`); ///${req.params.id}/${req.params.parcela}`);
    const result = await reopen(req.body);

    if (result.status) {
      res.status(500).send(result);
    } else {
      res.send(result);
    }

    //logger.info(`PUT /lancto/reopen/${req.params.id}/${req.params.parcela} - ${JSON.stringify(result)}`);
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
