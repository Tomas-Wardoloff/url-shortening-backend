import express from "express";

import UrlRouter from "./api/routers/urlRouter.js";
import AuthRouter from "./api/routers/authRouter.js";

const app = express();
const authRouter = new AuthRouter().getRouter();
const urlRouter = new UrlRouter().getRouter();

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/url", urlRouter);

export default app;
