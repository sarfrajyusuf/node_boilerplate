import { appInfo } from "@/common/utils";
import { app, logger } from "@/server";
import { env } from "./config/envConfig";

const server = app.listen(env.PORT, () => {
  const { NODE_ENV, HOST, PORT } = env;
  logger.info(`Server (${NODE_ENV}) running on port http://${HOST}:${PORT}`);
  console.log(
    `\n 🌼 Wallet app ${appInfo.version} Server \n\n╰╮\n\n ╰─ ✔︎ [ 2 ] ${appInfo.name} are enabled. \n\n  ❤︎ ᴀᴘᴘ ɪꜱ ʟɪꜱᴛᴇɴɪɴɢ ᴏɴ ᴘᴏʀᴛ ${PORT}\n\n `,
  );
});

const onCloseSignal = () => {
  logger.info("sigint received, shutting down");
  server.close(() => {
    logger.info("server closed");
    process.exit();
  });
  setTimeout(() => process.exit(1), 10000).unref(); // Force shutdown after 10s
};

process.on("SIGINT", onCloseSignal);
process.on("SIGTERM", onCloseSignal);
