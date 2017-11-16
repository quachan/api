// @flow

/*!
 * quachan
 * Copyright(c) 2017 93725638
 * MIT Licensed
 */

import Post from "../models/Post.js";
import type { $Post } from "../models/Post.js";

export async function addPost (post: $Post): Promise<$Post> {
    const postInstance = new Post();

    postInstance.thread = post.thread;
    postInstance.text = post.text;
    postInstance.author = post.author;
    postInstance.image = post.image;
    postInstance.pinned = post.pinned;
    postInstance.createdDate = post.createdDate;
    postInstance.updatedDate = post.updatedDate;

    return await postInstance.save();
}

type findPostOptions = {
    _id?: string,
    thread?: string,
    text?: string,
    image?: string,
    author?: string,
    pinned?: boolean
};

type getPostOptions = {
    find: findPostOptions,
    populate?: string
};

export async function getPost (options: getPostOptions): Promise<$Post> {
    options.populate = ("populate" in options) ? options.populate : "posts author image";

    if (options.find._id) {
        return await Post.findById(options.find._id).populate(options.populate);
    }

    return await Post.findOne(options.find).populate(options.populate);
}

type getPostsOptions = {
    find: findPostOptions,
    offset: number,
    limit: number,
    sortBy: "Default" | "NewToOld" | "OldToNew",
    populate?: string
};

export async function getPosts (options: getPostsOptions): Promise<Array<$Post>> {
    options.populate = ("populate" in options) ? options.populate : "posts author image";

    let query = Post.find(options.find);

    if (options.sortBy === "Default") {
        query = query.sort({
            pinned: -1,
            createdDate: 1
        });
    }
    else if (options.sortBy === "NewToOld") {
        query = query.sort({
            createdDate: -1
        });
    }
    else if (options.sortBy === "OldToNew") {
        query = query.sort({
            createdDate: 1
        });
    }

    query = query.skip(options.offset);

    query = query.limit(options.limit);

    if (options.populate) {
        query = query.populate(options.populate);
    }

    return await query;
}

type countPostsOptions = {
    _id?: string,
    text?: string,
    image?: string,
    author?: string
};

export async function countPosts (options: countPostsOptions): Promise<number> {
    return Post.count(options);
}
