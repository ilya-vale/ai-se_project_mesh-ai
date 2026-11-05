import type { Request, Response } from 'express';
import Document from '../models/document.js';
import Chunk from '../models/chunk.js';
import {createEmbedding} from '../utils/embeddings.js';
import { rankBySimilarity } from '../utils/vector-search.js';
import { buildContext } from '../utils/openai-client.js';
import Chat from '../models/chat.js';
import { generateAnswerFromLLM } from './query.js';
import Message from '../models/message.js';



export const createMessage = async (req: Request, res: Response): Promise<void> => {
  const { question } = req.body;
  const chatId = req.params.id;
  const userId = req.user!.userId;

  if (typeof chatId !== 'string') {
    res.status(404).json({
      success: false,
      data: null,
      error: { message: 'Chat not found' }
    });
    return;
  }


if (!question) {
    res.status(400).json({
      success: false,
      data: null,
      error: { message: 'Question required for query'}
    });
    return;
  }

const userChat = await Chat.findOne({_id: chatId, userId: userId});
if(!userChat) {
res.status(404).json({
  success: false,
  data: null,
  error: {message: 'Chat not found'}
});
return;
};

  const userDocs = await Document.find({ userId }, '_id');
  const docIds = userDocs.map((d) => d._id);
  const chunkRecords = await Chunk.find({ documentId: { $in: docIds } });
  const chunks = chunkRecords.map((c) => ({
    id: String(c._id),
    documentId: String(c.documentId),
    text: c.text,
    embedding: c.embedding,
  }));
  const queryEmbedding = await createEmbedding(question);
  const ranked = rankBySimilarity(queryEmbedding, chunks, 5);
  const context = buildContext(ranked);

  const answer = await generateAnswerFromLLM(question, context);
  const messageToBot = await Message.create({ role: 'user', chatId: chatId, content: question});
  const messageFromBot = await Message.create({ role: 'assistant', chatId: chatId, content: answer});

  res.status(201).json({
    success: true,
    data: [ messageToBot, messageFromBot],
    error: null
  });
}