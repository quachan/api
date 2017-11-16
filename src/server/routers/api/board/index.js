// @flow

/*!
 * quachan
 * Copyright(c) 2017 93725638
 * MIT Licensed
 */

import { Router } from "express";
import boardIdRouter from "./_boardID/";
import { getBoard, getBoards, addBoard } from "../../../../controllers/boardController.js";

const router = Router({
    mergeParams: true
});

router.get("/", (req, res) => res.send("Board Router"));

router.post("/", async (req, res) => {
    const { name, title } = req.body;

    const addedBoard = await addBoard({
        name,
        title,
        createdDate: new Date(),
        updatedDate: new Date()
    });

    res.send({
        data: addedBoard
    });
});

router.get("/list", async (req, res) => {
    const boards = await getBoards({});

    res.send({
        data: boards
    });
});

router.get("/find", async (req, res) => {
    const name = req.query.name;

    const foundBoard = await getBoard({
        name
    });

    res.send({
        data: foundBoard
    });
});

router.use("/:boardID", boardIdRouter);

export default router;
