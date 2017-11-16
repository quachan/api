// @flow

/*!
 * quachan
 * Copyright(c) 2017 93725638
 * MIT Licensed
 */

import { Router } from "express";
import { getThread } from "../../../../../controllers/threadController.js";
import deepPick from "deepPick";
import type { $Thread } from "../../../../../models/Thread.js";

const router = Router({
    mergeParams: true
});

router.get("/", async (req, res) => {
    const threadID = req.params.threadID;

    const foundThread: $Thread = await getThread({
        find: {
            _id: threadID
        }
    });

    if (!foundThread || !foundThread._id) {
        res.status(500).send({
            error: true,
            message: "Couldn't find the thread of given ID"
        });

        return;
    }
    
    const safeThread = deepPick(foundThread, ["_id", "board", "title", "text", "pinned", "createdDate", "updatedDate", "image._id", "image.name", "image.type", "image.width", "image.height", "image.bytes", "author._id", "author.name", "posts._id", "posts.pinned", "posts.createdDate", "posts.updatedDate", "posts.text", "posts.author._id", "posts.author.name", "posts.image._id", "posts.image.name", "posts.image.width", "posts.image.height", "posts.image.bytes"]);

    res.send({
        data: safeThread
    });
});

export default router;
