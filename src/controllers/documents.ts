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
        data: { document },
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

const getDocById = async (req: Request, res: Response): Promise<void> => {

    const docId = req.params.id;

    const document = await Document.findById(docId);

    res.status(200).json({
        success: true,
        data: { document },
        error: null
    });
};

const deleteDoc = async (req: Request, res: Response): Promise<void> => {

    const docId = req.params.id

    await Document.findByIdAndDelete(docId);
    res.status(204).end()
};

export { uploadDoc, getDocsForCurrentUser, getDocById, deleteDoc }