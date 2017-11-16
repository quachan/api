// @flow

/*!
 * quachan
 * Copyright(c) 2017 93725638
 * MIT Licensed
 */

import mongoose from "mongoose";
import deepPopulatePlugin from "mongoose-deep-populate";
import type { $Board } from "./Board.js";
import type { $Author } from "./Author.js";
import type { $Image } from "./Image.js";

export type $Thread = {
    _id?: string,
    board: $Board | string,
    title: string,
    text: string,
    image?: $Image | string,
    author: $Author | string,
    pinned: boolean,
    lastBumpDate: Date,
    createdDate: Date,
    updatedDate: Date
};

const threadSchema = new mongoose.Schema({
    board: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Board",
        index: true,
        required: true
    },
    title: {
        type: String,
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
    lastBumpDate: {
        type: Date,
        default: Date.now,
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

threadSchema.plugin(deepPopulatePlugin(mongoose));

export default mongoose.model("Thread", threadSchema);
