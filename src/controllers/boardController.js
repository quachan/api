// @flow

/*!
 * quachan
 * Copyright(c) 2017 93725638
 * MIT Licensed
 */

import Board from "../models/Board.js";
import type { $Board } from "../models/Board.js";

export async function addBoard (board: $Board): Promise<$Board> {
    const boardInstance = new Board();
    
    boardInstance.name = board.name;
    boardInstance.title = board.title;
    boardInstance.createdDate = board.createdDate;
    boardInstance.updatedDate = board.updatedDate;

    return await boardInstance.save();
}

type getBoardOptions = {
    _id?: string,
    name?: string,
    title?: string,
    threads?: Array<string> | string,
    selectFields?: string
};

export async function getBoard (options: getBoardOptions): Promise<$Board> {
    const selectFields = options.selectFields || "_id name title createdDate updatedDate";

    if (options._id) {
        return await Board.findById(options._id).select(selectFields);
    }

    return await Board.findOne(options).select(selectFields);
}

type getBoardsOptions = getBoardOptions;

export async function getBoards (options: getBoardsOptions): Promise<Array<$Board>> {
    const selectFields = options.selectFields || "_id name title createdDate updatedDate";

    return await Board.find(options).select(selectFields);
}

type countBoardsOptions = {
    _id?: string,
    name?: string,
    title?: string,
    threads?: Array<string> | string
};

export async function countBoards (options: countBoardsOptions): Promise<number> {
    return Board.count(options);
}
