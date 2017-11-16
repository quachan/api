// @flow

/*!
 * quachan
 * Copyright(c) 2017 93725638
 * MIT Licensed
 */

import Thread from "../models/Thread.js";
import type { $Thread } from "../models/Thread.js";

export async function addThread (thread: $Thread): Promise<$Thread> {
    const threadInstance = new Thread();

    threadInstance.board = thread.board;
    threadInstance.title = thread.title;
    threadInstance.text = thread.text;
    threadInstance.author = thread.author;
    threadInstance.image = thread.image;
    threadInstance.pinned = thread.pinned;
    threadInstance.lastBumpDate = thread.lastBumpDate;
    threadInstance.createdDate = thread.createdDate;
    threadInstance.updatedDate = thread.updatedDate;

    return await threadInstance.save();
}

export async function bumpThread (threadID: string) {
    return await Thread.update({
        _id: threadID
    }, {
        $set: {
            lastBumpDate: new Date()
        }
    });
}

type findThreadOptions = {
    _id?: string,
    board?: string,
    title?: string,
    text?: string,
    image?: string,
    author?: string
}

type getThreadOptions = {
    find: findThreadOptions,
    populate?: string
};

export async function getThread (options: getThreadOptions): Promise<$Thread> {
    options.populate = ("populate" in options) ? options.populate : "posts author image posts.image posts.author";

    if (options.find._id) {
        return await Thread.findById(options.find._id).deepPopulate(options.populate);
    }

    return await Thread.findOne(options.find).deepPopulate(options.populate);
}

type getThreadsOptions = {
    find: findThreadOptions,
    limit: number,
    offset: number,
    populate?: string
};

export async function getThreads (options: getThreadsOptions): Promise<Array<$Thread>> {
    options.populate = ("populate" in options) ? options.populate : "posts author image posts.image posts.author";

    let query = Thread.find(options.find);

    query = query.skip(options.offset);

    query = query.limit(options.limit);

    query = query.deepPopulate(options.populate);

    return await query;
}

type getSortedThreadsOptions = {
    find: findThreadOptions,
    limit: number,
    offset: number,
    sortBy: "Bump" | "NewToOld",
    populate?: string
};

export async function getSortedThreads (options: getSortedThreadsOptions): Promise<Array<$Thread>> {
    options.populate = ("populate" in options) ? options.populate : "posts author image posts.image posts.author";

    let query = Thread.find(options.find);
    
    if (options.sortBy === "Bump") {
        query = query.sort({
            pinned: -1,
            lastBumpDate: -1
        });
    }
    else if (options.sortBy === "NewToOld") {
        query = query.sort({
            pinned: -1,
            createdDate: -1
        });
    }
    
    query = query.skip(options.offset);

    query = query.limit(options.limit);

    query = query.deepPopulate(options.populate);

    return await query;
}

type countThreadsOptions = findThreadOptions;

export async function countThreads (options: countThreadsOptions): Promise<number> {
    return Thread.count(options);
}
