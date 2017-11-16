// @flow

/*!
 * quachan
 * Copyright(c) 2017 93725638
 * MIT Licensed
 */

import mongoose from "mongoose";
import type { $Author } from "./Author.js";

export type $Image = {
    _id?: string,
    name: string,
    path: string,
    type: string,
    width: string,
    height: string,
    bytes: number,
    author: $Author | string
};

const imageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    width: {
        type: String,
        required: true
    },
    height: {
        type: String,
        required: true
    },
    bytes: {
        type: Number,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Author",
        required: true
    }
});

export default mongoose.model("Image", imageSchema);
