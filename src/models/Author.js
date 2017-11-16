// @flow

/*!
 * quachan
 * Copyright(c) 2017 93725638
 * MIT Licensed
 */

import mongoose from "mongoose";

export type $Author = {
    _id?: string,
    name: string,
    ip: string,
    createdDate: Date,
    updatedDate: Date
};

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        default: "Anonymous",
        required: false
    },
    ip: {
        type: String,
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

export default mongoose.model("Author", authorSchema);
