/*!
 * quachan
 * Copyright(c) 2017 93725638
 * MIT Licensed
 */

import cluster from "cluster";
import { cpus } from "os";
import server from "../server/";
import isDev from "../utils/isDev.js";

const customPort = process.env.IBB_PORT;
const customThreadsNumber = process.env.IBB_THREADS;

if (cluster.isMaster && !isDev) {
    console.log(`Master with PID: ${process.pid} is running`);

    const threadsCount = customThreadsNumber ? parseInt(customThreadsNumber) : cpus().length;
    
    for (let i = 0; i < threadsCount; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
        console.error(`Worker with PID: ${worker.process.pid} died; Code: ${code}; Signal: ${signal}`);

        cluster.fork();
    });
} 
else {
    const port = customPort || (isDev ? 3000 : 80);

    server.listen(port, () => console.log(`Server of worker with PID: ${process.pid} is listening on port ${port}`));

    console.log(`Worker with PID: ${process.pid} started`);
}
