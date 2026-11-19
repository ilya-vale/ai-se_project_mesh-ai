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
        data: document,
        error: null
    });
};

const getDocsForCurrentUser = async (req: Request, res: Response): Promise<void> => {

    const userId = req.user!.userId;

    const userDocs = await Document.find({ userId })

    if (userDocs.length === 0) {
        res.status(404).json({
            success: false,
            data: null,
            error: { message: 'No documents found'}
        });
    }

    res.status(200).json({
        success: true,
        data: userDocs,
        error: null
    });
};

const getDocById = async (req: Request, res: Response): Promise<void> => {

    const docId = req.params.id;

    const document = await Document.findById(docId);

    if (!document) {
        res.status(404).json({
            success: false,
            data: null,
            error: { message: 'Document not found' }
        })
    }

    res.status(200).json({
        success: true,
        data: document,
        error: null
    });
};

const deleteDoc = async (req: Request, res: Response): Promise<void> => {

    const docId = req.params.id

    if (!docId) {    
        res.status(400).json({
            success: false,
            data: null,
            error: {message: 'Document already deleted/not found'}
        });
    }

    await Document.findByIdAndDelete(docId);
    res.status(204).end()
};

export { uploadDoc, getDocsForCurrentUser, getDocById, deleteDoc }