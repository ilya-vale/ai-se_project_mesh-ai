import type { Request, Response } from 'express';

const getAllChats = (req:Request, res: Response): void => {
    res.status(200).json({
        success: true,
        data: {},
        error: null
    });
};

const createNewChat = (req:Request, res: Response): void => {
    const { title, body } = req.body;

    if (!title || !body) {
        res.status(400).json({
            success: false,
            data: null,
            error: { message: 'title and body are required'}
        });
        return;
    };
    res.status(201).json({
        success: true,
        data: {},
        error: null
    });
};

const getChatById = (req:Request, res: Response): void => {
    res.status(200).json({
        success: true,
        data: {},
        error: null
    });
};

const deleteChat = (req:Request, res: Response): void => {
    console.log("Chat deleted");
    res.status(204).end();
};

const sendChatGetReply = (req:Request, res: Response): void => {
    res.status(201).json({
        success: true,
        data: {},
        error: null
    });
};

export { getAllChats, createNewChat, getChatById, deleteChat, sendChatGetReply};