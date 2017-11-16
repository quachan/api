/*!
 * quachan
 * Copyright(c) 2017 93725638
 * MIT Licensed
 */

import { Router } from "express";
import boardRouter from "./board/";
import threadRouter from "./thread/";
import postRouter from "./post/";
import imageRouter from "./image/";

const router = Router();

router.get("/", (req, res) => res.send("API Router"));

router.use("/board", boardRouter);
router.use("/thread", threadRouter);
router.use("/post", postRouter);
router.use("/image", imageRouter);

export default router;
