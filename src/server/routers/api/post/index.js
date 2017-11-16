// @flow

/*!
 * quachan
 * Copyright(c) 2017 93725638
 * MIT Licensed
 */

import { Router } from "express";
import postIdRouter from "./_postID/";
import multer from "multer";
import readChunk from "read-chunk";
import fileType from "file-type";
import { resolve } from "path";
import deepPick from "deepPick";
import { addImage } from "../../../../controllers/imageController.js";
import type { $Image } from "../../../../models/Image.js";
import { getAuthor, addAuthor } from "../../../../controllers/authorController.js";
import type { $Author } from "../../../../models/Author.js";
import { addPost, getPosts } from "../../../../controllers/postController.js";
import type { $Post } from "../../../../models/Post.js";
import { countThreads, bumpThread } from "../../../../controllers/threadController.js";
import _calipers from "calipers";
import { unlink } from "fs-extra";

const calipers = _calipers("png", "jpeg", "gif");

const router = Router();

router.get("/", (req, res) => res.send("Post Router"));

const upload = multer({ 
    dest: "upload/",
    limits: {
        fileSize: 10485760
    }
});
router.post("/", upload.single("main-image"), async (req, res) => {
    const { threadID, text } = req.body;

    const hasImage = !!(req.file && req.file.path);

    if (!threadID || !text) {
        if (hasImage) {
            await unlink(req.file.path);
        }

        res.status(500).send({
            error: true,
            message: "You didn't specify any threadID or text"
        });

        return;
    }

    const threadExists = !!(await countThreads({ _id: threadID }));

    if (!threadExists) {
        if (hasImage) {
            await unlink(req.file.path);
        }

        res.status(500).send({
            error: true,
            message: "Thread of given ID doesn't exist"
        });

        return;
    }

    const foundAuthor: $Author = await getAuthor({
        ip: req.clientIp
    });

    const author: $Author = foundAuthor || await addAuthor({
        name: "Anonymous",
        ip: req.clientIp,
        createdDate: new Date(),
        updatedDate: new Date()
    });

    if (!author || !author._id) {
        if (hasImage) {
            await unlink(req.file.path);
        }

        res.status(500).send({
            error: true,
            message: "Failed to find or add the author"
        });

        return;
    }

    let postImage = {};

    if (hasImage) {
        const mainImage = req.file;
        const mainImageChunk = await readChunk(mainImage.path, 0, 4100);
        const mainImageType = fileType(mainImageChunk);
        const mainImageDimensions = await calipers.measure(mainImage.path);
    
        const allowedTypes = ["image/gif", "image/png", "image/jpeg", "image/bmp"];
        if (!allowedTypes.includes(mainImageType.mime)) {
            await unlink(mainImage.path);
            
            res.status(500).send({
                error: true,
                message: "Invalid file type"
            });

            return;
        }

        const addedImage: $Image = await addImage({
            name: mainImage.originalname,
            path: resolve(mainImage.path),
            type: mainImageType.mime,
            width: mainImageDimensions.pages[0].width,
            height: mainImageDimensions.pages[0].height,
            bytes: mainImage.size,
            author: author._id || ""
        });
    
        if (!addedImage || !addedImage._id) {
            await unlink(req.file.path);

            res.status(500).send({
                error: true,
                message: "Failed to add the image"
            });
    
            return;
        }

        postImage = addedImage;
    }

    const addedPost: $Post = await addPost({
        ...(hasImage ? { image: postImage._id } : {}),
        thread: threadID,
        author: author._id || "",
        pinned: false,
        createdDate: new Date(),
        updatedDate: new Date(),
        text
    });

    await bumpThread(threadID);

    const safePost = deepPick(addedPost, ["_id", "text"]);

    res.send({
        data: safePost
    });
});

router.get("/find", async (req, res) => {
    let { threadID, limit, offset, sortBy } = req.query;

    if (!limit || limit < 1 || (threadID ? limit > 2000 : limit > 100)) {
        limit = threadID ? 2000 : 100;
    }

    limit = parseInt(limit) || threadID ? 2000 : 100;

    if (!offset || offset < 0) {
        offset = 0;
    }

    offset = parseInt(offset) || 0;

    if (!sortBy || !["Default", "NewToOld", "OldToNew"].includes(sortBy)) {
        sortBy = "Default";
    }

    const foundPosts = await getPosts({
        find: {
            ...(threadID ? { thread: threadID } : {})
        },
        offset,
        limit,
        sortBy
    });

    const safePosts = foundPosts.map((post) => {
        return deepPick(post, ["_id", "text", "pinned", "createdDate", "updatedDate", "image._id", "image.name", "image.type", "image.width", "image.height", "image.bytes", "author._id", "author.name"]);
    });

    res.send({
        data: safePosts
    });
});

router.use("/:postID", postIdRouter);

export default router;
