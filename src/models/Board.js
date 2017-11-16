// @flow

/*!
 * quachan
 * Copyright(c) 2017 93725638
 * MIT Licensed
 */

import mongoose from "mongoose";

export type $Board = {
    _id?: string,
    name: string,
    title: string,
    createdDate: Date,
    updatedDate: Date
};

const boardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    title: {
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

export default mongoose.model("Board", boardSchema);
