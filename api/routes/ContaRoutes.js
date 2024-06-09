import express from "express";
import { insert, update, exclude, getById, getByType } from "../db/ContaDb.js";

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    logger.info(`POST /conta`); // - ${JSON.stringify(req.body)}`);
    const result = await insert(req.body);

    if (result.status) {
      res.status(500).send(result);
    } else {
      res.send(result);
    }

    logger.info(`POST /conta - ${JSON.stringify(result)}`);
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
    logger.info(`PUT /conta`); // - ${JSON.stringify(req.body)}`);
    const result = await update(req.body);

    if (result.status) {
      res.status(500).send(result);
    } else {
      res.send(result);
    }

    logger.info(`PUT /conta - ${JSON.stringify(result)}`);
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
    logger.info(`DELETE /conta/${req.params.id}`);
    const result = await exclude(req.params.id);

    if (result.status) {
      res.status(500).send(result);
    } else {
      res.send(result);
    }

    logger.info(`DELETE /conta/${req.params.id} - ${JSON.stringify(result)}`);
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
  try {
    var result;

    if (
      req.params.id === "d" ||
      req.params.id === "D" ||
      req.params.id === "c" ||
      req.params.id === "C"
    ) {
      result = await getByType(req.params.id.toUpperCase());
    } else {
      if (!isNaN(req.params.id)) {
        logger.info(`GET /conta/${req.params.id} `);
      } else {
        logger.info("GET /conta");
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

//router.use((err, req, res) => {
//    logger.error(`${req.method} ${req.originalUrl} - ${err.message.trim()} `);
//    res.status(400).send({ error: 1, message: err.message.trim() });
//});

export default router;
