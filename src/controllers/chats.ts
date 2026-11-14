import type { Request, Response } from 'express';
import Chat from '../models/chat.js';



const getAllChats = (req:Request, res: Response): void => {
    

    res.status(200).json({
        success: true,
        data: {},
        error: null
    });
};

const createNewChat = async (req:Request, res: Response): Promise<void> => {
    const { title } = req.body;
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
        data: { createdChat },
        error: null
    });
};

const getChatById = async (req:Request, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const chat = await Chat.findOne({ _id: req.params.id, userId: userId });
    res.status(200).json({
        success: true,
        data: { chat },
        error: null
    });
};

const deleteChat = async (req:Request, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const chat = await Chat.findOne({ _id: req.params.id, userId: userId });
    await Chat.findByIdAndDelete(chat?._id);
    console.log("Chat deleted");
    res.status(204).end();
};


export { getAllChats, createNewChat, getChatById, deleteChat };