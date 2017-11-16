/*!
 * quachan
 * Copyright(c) 2017 93725638
 * MIT Licensed
 */

import { Router } from "express";
import apiRouter from "./api/";

const router = Router();

router.get("/", (req, res) => res.send("Main Router"));

router.use("/api", apiRouter);

export default router;
