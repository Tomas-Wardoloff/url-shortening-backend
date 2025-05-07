import express from "express";
import swaggerUi from "swagger-ui-express";

import specs from "./api/config/swagger.js";
import UrlRouter from "./api/routers/urlRouter.js";
import AuthRouter from "./api/routers/authRouter.js";
import TagRouter from "./api/routers/tagRouter.js";
import ErrorHandler from "./api/middlewares/errorHandler.js";

const app = express();
const authRouter = new AuthRouter().getRouter();
const urlRouter = new UrlRouter().getRouter();
const tagRouter = new TagRouter().getRouter();

app.use(express.json());
app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);
app.use("/api/auth", authRouter);
app.use("/api/url", urlRouter);
app.use("/api/tag", tagRouter);

app.use(ErrorHandler);

export default app;
