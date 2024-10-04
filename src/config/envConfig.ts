import dotenv from "dotenv";
import { cleanEnv, host, num, port, str, testOnly } from "envalid";

dotenv.config();

export const env = cleanEnv(process.env, {
  NODE_ENV: str({
    devDefault: testOnly("test"),
    choices: ["development", "production", "test"],
    desc: "The environment in which the application is running",
    example: "development",
  }),
  HOST: host({
    devDefault: testOnly("localhost"),
    desc: "The host on which the application is running",
    example: "localhost",
  }),
  PORT: port({
    devDefault: testOnly(3000),
    desc: "The port on which the application is running",
    example: "3000",
  }),
  CORS_ORIGIN: str({
    devDefault: testOnly("http://localhost:3000"),
    desc: "The origin allowed for CORS",
    example: "http://localhost:3000",
  }),
  COMMON_RATE_LIMIT_MAX_REQUESTS: num({
    devDefault: testOnly(1000),
    desc: "The maximum number of requests allowed in a rate limit window",
    example: "1000",
  }),
  COMMON_RATE_LIMIT_WINDOW_MS: num({
    devDefault: testOnly(1000),
    desc: "The duration of the rate limit window in milliseconds",
    example: "1000",
  }),

  // SQL Database configuration
  SQL_HOST: host({
    devDefault: testOnly("localhost"),
    desc: "The SQL database host",
    example: "localhost",
  }),
  SQL_PORT: port({
    devDefault: testOnly(5432),
    desc: "The SQL database port",
    example: "5432",
  }),
  SQL_USER: str({
    devDefault: testOnly("user"),
    desc: "The SQL database user",
    example: "user",
  }),
  SQL_PASSWORD: str({
    devDefault: testOnly("password"),
    desc: "The SQL database password",
    example: "password",
  }),
  SQL_DATABASE: str({
    devDefault: testOnly("database"),
    desc: "The SQL database name",
    example: "database",
  }),
  JWT_SECRET: str({
    devDefault: testOnly("my-secret"),
    desc: "the JWT secret is required",
    example: "my-secret",
  }),
});
