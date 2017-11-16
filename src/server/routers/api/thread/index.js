// @flow

/*!
 * quachan
 * Copyright(c) 2017 93725638
 * MIT Licensed
 */

import { Router } from "express";
import threadIdRouter from "./_threadID/";
import multer from "multer";
import readChunk from "read-chunk";
import fileType from "file-type";
import { resolve } from "path";
import deepPick from "deepPick";
import { addImage } from "../../../../controllers/imageController.js";
import type { $Image } from "../../../../models/Image.js";
import { getAuthor, addAuthor } from "../../../../controllers/authorController.js";
import type { $Author } from "../../../../models/Author.js";
import { addThread, getSortedThreads } from "../../../../controllers/threadController.js";
import type { $Thread } from "../../../../models/Thread.js";
import { countBoards } from "../../../../controllers/boardController.js";
import _calipers from "calipers";
import { unlink } from "fs-extra";

const calipers = _calipers("png", "jpeg", "gif");

const router = Router();

router.get("/", (req, res) => res.send("Thread Router"));

const upload = multer({ 
    dest: "upload/",
    limits: {
        fileSize: 10485760
    }
});
router.post("/", upload.single("main-image"), async (req, res) => {
    const { boardID, title, text } = req.body;

    const hasImage = !!(req.file && req.file.path);

    if (!boardID || !title || !text) {
        if (hasImage) {
            await unlink(req.file.path);
        }

        res.status(500).send({
            error: true,
            message: "You didn't specify the boardID, title or text"
        });

        return;
    }

    const boardExists = !!(await countBoards({ _id: boardID }));

    if (!boardExists) {
        if (hasImage) {
            await unlink(req.file.path);
        }

        res.status(500).send({
            error: true,
            message: "The board of given ID doesn't exist"
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

    let threadImage = {};

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
            width: (mainImageDimensions.pages || [{}])[0].width,
            height: (mainImageDimensions.pages || [{}])[0].height,
            bytes: mainImage.size,
            author: author._id || ""
        });
    
        if (!addedImage || !addedImage._id) {
            await unlink(mainImage.path);
            
            res.status(500).send({
                error: true,
                message: "Failed to add the image"
            });
    
            return;
        }

        threadImage = addedImage;
    }

    const addedThread: $Thread = await addThread({
        board: boardID,
        ...(hasImage ? { image: threadImage._id } : {}),
        author: author._id || "",
        posts: ([]: Array<string>),
        pinned: false,
        lastBumpDate: new Date(),
        createdDate: new Date(),
        updatedDate: new Date(),
        title,
        text,
    });

    const safeThread = deepPick(addedThread, ["_id", "board", "title", "text", "pinned", "createdDate", "updatedDate", "image._id", "image.name", "image.type", "author._id", "author.name", "posts.text", "posts.author._id", "posts.author.name", "posts.image._id", "posts.image.name"]);

    res.send({
        data: safeThread
    });
});

router.get("/find", async (req, res) => {
    let { boardID, sortBy, limit, offset } = req.query;

    if (!sortBy || (sortBy !== "NewToOld" && sortBy !== "Bump" )) {
        sortBy = "Bump";
    }

    if (!limit || limit < 1 || limit > 100) {
        limit = 100;
    }

    limit = parseInt(limit) || 100;

    if (!offset || offset < 0) {
        offset = 0;
    }

    offset = parseInt(offset) || 0;

    if (boardID) {
        const boardExists = !!(await countBoards({ _id: boardID }));
    
        if (!boardExists) {
            res.status(500).send({
                error: true,
                message: "The board of given ID doesn't exist"
            });
        }
    }
    
    const foundThreads = await getSortedThreads({
        find: {
            ...(boardID ? { board: boardID } : {})
        },
        offset,
        limit,
        sortBy
    });

    const safeThreads = foundThreads.map((thread) => {
        return deepPick(thread, ["_id", "board", "title", "text", "pinned", "createdDate", "updatedDate", "image._id", "image.name", "image.type", "image.width", "image.height", "image.bytes", "author._id", "author.name", "posts._id", "posts.pinned", "posts.createdDate", "posts.updatedDate", "posts.text", "posts.author._id", "posts.author.name", "posts.image._id", "posts.image.name", "posts.image.width", "posts.image.height", "posts.image.bytes"]);
    });

    res.send({
        data: safeThreads
    });
});

router.use("/:threadID", threadIdRouter);

export default router;
