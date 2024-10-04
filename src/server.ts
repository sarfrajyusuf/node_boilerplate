import routes from "@/api";
import { openAPIRouter } from "@/api-docs/openAPI.Router";
import { apiLogger, errorHandler, rateLimiter, requestLogger } from "@/common/middleware";
import { env } from "@/config/envConfig";
import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { pino } from "pino";
import "colors";
import { checkConnection } from "@/common/db/sequelize";
import { API } from "./common/contants";

(async () => {
  await checkConnection();
})();

const logger = pino({ name: "server start" });
const app: Express = express();
app.use(apiLogger);

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(rateLimiter);

// Request logging
app.use(requestLogger);

// Routes
app.use(API.BASE_URL, routes);

// Swagger UI
app.use("/swagger", openAPIRouter);

// Error handlers
app.use(errorHandler());

export { app, logger };
