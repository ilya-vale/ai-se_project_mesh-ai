import type { Request, Response } from 'express';
import documentSchema from '../models/document.js';

const uploadDoc = (req: Request, res: Response): void => {

    if (!req.file) {
        res.status(400).json({
            success: false, 
            data: null,
            error: { message: 'valid file required'}
        });
        return;
    }

    
    res.status(201).json({
        success: true,
        data: {},
        error: null
    });
};

const getDocsForCurrentUser = async (req: Request, res: Response): Promise<void> => {

    const userId = req.user!.userId;

    const userDocs = await documentSchema.find({ userId })

    res.status(200).json({
        success: true,
        data: {userDocs},
        error: null
    });
};

const getDocById = (req: Request, res: Response): void => {
    res.status(200).json({
        success: true,
        data: {},
        error: null
    });
};

const deleteDoc = (req: Request, res: Response): void => {
    res.status(204).end();
};

export { uploadDoc, getDocsForCurrentUser, getDocById, deleteDoc }