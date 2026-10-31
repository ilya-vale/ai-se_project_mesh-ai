import { Router } from "express";
import { getAllChats, createNewChat, getChatById, deleteChat,sendChatGetReply } from "../controllers/chats.js";
import { auth } from '../middleware/auth.js';

const chatRouter = Router();

console.log("chats.ts loaded")

chatRouter.use(auth)

chatRouter.get("/", getAllChats);
chatRouter.post("/", createNewChat);
chatRouter.get("/:id", getChatById);
chatRouter.delete("/:id", deleteChat);
chatRouter.post("/:id/messages", sendChatGetReply);

export { chatRouter };