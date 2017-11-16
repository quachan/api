/*!
 * quachan
 * Copyright(c) 2017 93725638
 * MIT Licensed
 */

import express from "express";
import { json, urlencoded } from "body-parser";
import requestIp from "request-ip";
import mainRouter from "./routers/";

const app = express();

app.use(requestIp.mw());

app.use(urlencoded({ extended: false }));
app.use(json());

app.use(mainRouter);

export default app;
