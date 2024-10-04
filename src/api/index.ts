import { blockchainRouter } from "@/api/blockchain/blockchain.router";
import { crosschainRouter } from "@/api/crossPlatform/crossPlatform.router";
import { healthCheckRouter } from "@/api/healthCheck/healthCheck.router";
import { userRouter } from "@/api/user/user.router";
import { rampRouter } from "@/api/ramp/ramp.router";

// routes.ts
import { Router } from "express";

const router = Router();
router.use(blockchainRouter);
router.use(crosschainRouter);
router.use("/health-check", healthCheckRouter);
router.use(userRouter);
router.use(rampRouter);


export default router;
