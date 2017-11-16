// @flow

/*!
 * quachan
 * Copyright(c) 2017 93725638
 * MIT Licensed
 */

import Author from "../models/Author.js";
import type { $Author } from "../models/Author.js";

export async function addAuthor (author: $Author): Promise<$Author> {
    const authorInstance = new Author();

    authorInstance.name = author.name;
    authorInstance.ip = author.ip;
    authorInstance.createdDate = author.createdDate;
    authorInstance.updatedDate = author.updatedDate;

    return await authorInstance.save();
}

type getAuthorOptions = {
    _id?: string,
    name?: string,
    ip?: string
};

export async function getAuthor (options: getAuthorOptions): Promise<$Author> {
    if (options._id) {
        return await Author.findById(options._id);
    }

    return await Author.findOne(options);
}
