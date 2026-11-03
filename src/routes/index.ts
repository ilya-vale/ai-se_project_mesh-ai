import { Router } from "express";
import { authRouter } from "./auth.js";
import { chatsRouter } from "./chats.js";
import { docsRouter } from "./documents.js";
import { queryRouter } from "./query.js";

const router = Router();

console.log("router hit");

router.use("/auth", authRouter);
router.use("/chats", chatsRouter);
router.use("/documents", docsRouter);
router.use("/query", queryRouter);

export default router;