// @flow

/*!
 * quachan
 * Copyright(c) 2017 93725638
 * MIT Licensed
 */

import { Router } from "express";
import { getPost } from "../../../../../controllers/postController.js";
import deepPick from "deepPick";
import type { $Post } from "../../../../../models/Post.js";

const router = Router({
    mergeParams: true
});

router.get("/", async (req, res) => {
    const postID = req.params.postID;
    
    const foundPost: $Post = await getPost({
        find: {
            _id: postID
        }
    });

    if (!foundPost || !foundPost._id) {
        res.status(500).send({
            error: true,
            message: "Couldn't find the post of given ID"
        });

        return;
    }

    const safePost = deepPick(foundPost, ["_id", "text", "pinned", "createdDate", "updatedDate", "image._id", "image.name", "image.type", "image.width", "image.height", "image.bytes", "author._id", "author.name"]);

    res.send({
        data: safePost
    });
});

export default router;
