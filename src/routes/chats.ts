import { Router } from "express";
import { getAllChats, createNewChat, getChatById, deleteChat } from "../controllers/chats.js";
import { auth } from '../middleware/auth.js';
import { createMessage } from '../controllers/messages.js';


const chatsRouter = Router();

chatsRouter.use(auth)

chatsRouter.get("/", getAllChats);
chatsRouter.post("/", createNewChat);
chatsRouter.get("/:id", getChatById);
chatsRouter.delete("/:id", deleteChat);
chatsRouter.post('/:id/messages', createMessage);

export { chatsRouter };