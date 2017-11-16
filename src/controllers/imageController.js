// @flow

/*!
 * quachan
 * Copyright(c) 2017 93725638
 * MIT Licensed
 */

import Image from "../models/Image.js";
import type { $Image } from "../models/Image.js";

export async function addImage (image: $Image): Promise<$Image> {
    const imageInstance = new Image();

    imageInstance.name = image.name;
    imageInstance.path = image.path;
    imageInstance.type = image.type;
    imageInstance.width = image.width;
    imageInstance.height = image.height;
    imageInstance.bytes = image.bytes;
    imageInstance.author = image.author;

    return await imageInstance.save();
}

type getImageOptions = {
    _id?: string,
    name?: string,
    path?: string,
    type?: string,
    author?: string
};

export async function getImage (options: getImageOptions): Promise<$Image> {
    if (options._id) {
        return await Image.findById(options._id);
    }

    return await Image.findOne(options).populate("author");
}
