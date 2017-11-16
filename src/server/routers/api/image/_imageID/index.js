// @flow

/*!
 * quachan
 * Copyright(c) 2017 93725638
 * MIT Licensed
 */

import { Router } from "express";
import { createReadStream } from "fs";
import sharp from "sharp";
import { getImage } from "../../../../../controllers/imageController.js";
import type { $Image } from "../../../../../models/Image.js";

const router = Router({
    mergeParams: true
});

router.get("/", (req, res) => res.send("_imageID Router"));

router.get("/view", async (req, res) => {
    const imageID = req.params.imageID;
    
    const foundImage: $Image = await getImage({
        _id: imageID
    });

    if (!foundImage || !foundImage._id) {
        res.status(500).send({
            error: true,
            message: "Couldn't find the image of given ID"
        });

        return;
    }

    const imageStream = createReadStream(foundImage.path);

    imageStream.pipe(res);
});

router.get("/preview", async (req, res) => {
    const imageID = req.params.imageID;
    
    const foundImage: $Image = await getImage({
        _id: imageID
    });

    if (!foundImage || !foundImage._id) {
        res.status(500).send({
            error: true,
            message: "Couldn't find the image of given ID"
        });

        return;
    }

    const imageStream = createReadStream(foundImage.path);

    let dimensions = {
        width: parseInt(foundImage.width),
        height: parseInt(foundImage.height)
    };

    let newDimensions = {};

    if (dimensions.width > dimensions.height) {
        newDimensions.height = Math.round(dimensions.height * (400/dimensions.width));
    }
    else if (dimensions.width < dimensions.height) {
        newDimensions.width = Math.round(dimensions.width * (200/dimensions.height));
    }
    else {
        newDimensions.width = 200;
        newDimensions.height = 200;
    }

    const resizeForPreview = sharp().resize(newDimensions.width, newDimensions.height);

    imageStream.pipe(resizeForPreview).pipe(res);
});

export default router;
