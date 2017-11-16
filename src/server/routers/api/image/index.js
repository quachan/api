// @flow

/*!
 * quachan
 * Copyright(c) 2017 93725638
 * MIT Licensed
 */

import { Router } from "express";
import imageIdRouter from "./_imageID/";

const router = Router();

router.get("/", (req, res) => res.send("Image Router"));

router.use("/:imageID", imageIdRouter);

export default router;
