import express from "express";

import authRouter from "./api/routers/authRouter.js";

const app = express();

app.use(express.json());

app.use("/api/auth", authRouter);

export default app;
