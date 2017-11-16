// @flow

/*!
 * quachan
 * Copyright(c) 2017 93725638
 * MIT Licensed
 */

import { Router } from "express";
import { getBoard } from "../../../../../controllers/boardController.js";
import type { $Board } from "../../../../../models/Board.js";

const router = Router({
    mergeParams: true
});

router.get("/", async (req, res) => {
    const boardID = req.params.boardID;

    const foundBoard: $Board = await getBoard({ _id: boardID });

    if (!foundBoard || !foundBoard._id) {
        res.status(500).send({
            error: true,
            message: "Couldn't find board of given ID"
        });

        return;
    }

    res.send({
        data: foundBoard
    });
});

export default router;
