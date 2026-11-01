import type { Request, Response } from 'express';
import Document from '../models/document.js';
import { readFileSync } from 'fs';
import { PDFParse } from 'pdf-parse';
import { chunkText } from '../utils/chunks.js';
import Chunk from '../models/chunk.js';
import { createEmbedding } from '../utils/embeddings.js';



const uploadDoc = async (req: Request, res: Response): Promise<void> => {

    if (!req.file) {
        res.status(400).json({
            success: false, 
            data: null,
            error: { message: 'valid file required'}
        });
        return;
    }
  const buffer = readFileSync(req.file.path);
  const parser = new PDFParse({ data: buffer });
  const { text } = await parser.getText();

  const chunks = chunkText(text);

  const title = req.body.title || req.file.originalname;
  const userId = req.user!.userId;

  const document = await Document.create({
    title,
    userId,
    fileName: req.file.originalname,
  });

  await Promise.all(
  chunks.map(async (text) => {
    const embedding = await createEmbedding(text);
    return Chunk.create({ 
        documentId: document._id,
        text,
        embedding 
    });
  })
);
    
    res.status(201).json({
        success: true,
        data: {},
        error: null
    });
};

const getDocsForCurrentUser = async (req: Request, res: Response): Promise<void> => {

    const userId = req.user!.userId;

    const userDocs = await Document.find({ userId })

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