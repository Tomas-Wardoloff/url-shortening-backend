import express from "express";

import AuthRouter from "./api/routers/authRouter.js";

const app = express();
const authRouter = new AuthRouter().getRouter();

app.use(express.json());

app.use("/api/auth", authRouter);

export default app;
