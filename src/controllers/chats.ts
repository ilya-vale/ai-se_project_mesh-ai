import type { Request, Response } from 'express';
import Chat from '../models/chat.js';
import Message from '../models/message.js';


const getAllChats = async (req:Request, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const chatsForUser = await Chat.find({userId});
    if (chatsForUser.length === 0) {
        res.status(404).json({
            success: false,
            data: null,
            error: {message: 'No chats found'}
        });    
    return;
    }
    res.status(200).json({
        success: true,
        data: chatsForUser,
        error: null
    });
};

const createNewChat = async (req:Request, res: Response): Promise<void> => {
    const title = req.body?.title;
    const userId = req.user!.userId;
    if (!title) {
        res.status(400).json({
            success: false,
            data: null,
            error: { message: 'Missing title'}
        });
    return;
    }
    const createdChat = await Chat.create({title, userId})
        res.status(201).json({
            success: true,
            data: createdChat,
            error: null
        });
};

const getChatById = async (req:Request, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    
    const chat = await Chat.findOne({ _id: req.params.id, userId: userId });
    if (!chat) {
        res.status(404).json({
            success: false,
            data: null,
            error: {message: 'Chat not found'}
        });
        return;
    }
    const messages = await Message.find({chatId: chat._id}).sort({createdAt: 1});
    if (messages.length === 0) {
        res.status(404).json({
            success: false,
            data: null,
            error: {message: 'Chat contains no messages'}
        });
        return;
    }
    res.status(200).json({
        success: true,
        data: { chat, messages },
        error: null
    });
};

const deleteChat = async (req:Request, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const chat = await Chat.findOne({ _id: req.params.id, userId: userId });

        if (!chat) {
        res.status(404).json({
            success: false,
            data: null,
            error: {message: 'Chat already deleted/not found'}
        });
        return;
    }
    await Chat.findByIdAndDelete(chat?._id);
    console.log("Chat deleted");
    res.status(204).end();
};


export { getAllChats, createNewChat, getChatById, deleteChat };