// @flow

/*!
 * quachan
 * Copyright(c) 2017 93725638
 * MIT Licensed
 */

import mongoose from "mongoose";
import type { $Thread } from "./Thread.js";
import type { $Author } from "./Author.js";
import type { $Image } from "./Image.js";

export type $Post = {
    _id?: string,
    thread: $Thread | string,
    text: string,
    image?: $Image | string,
    author: $Author | string,
    pinned: boolean,
    createdDate: Date,
    updatedDate: Date
};

const postSchema = new mongoose.Schema({
    thread: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Thread",
        index: true,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    image: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Image",
        required: false
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Author",
        required: true
    },
    pinned: {
        type: Boolean,
        default: false,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    updatedDate: {
        type: Date,
        default: Date.now,
        required: true
    }
});

export default mongoose.model("Post", postSchema);
