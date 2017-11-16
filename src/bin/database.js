/*!
 * quachan
 * Copyright(c) 2017 93725638
 * MIT Licensed
 */

import mongoose from "mongoose";

mongoose.Promise = Promise;

const customDbConnString = process.env.IBB_DB_CONN_STR;

export default mongoose.connect(customDbConnString || "mongodb://localhost/imageboard-back", {
    useMongoClient: true
});
