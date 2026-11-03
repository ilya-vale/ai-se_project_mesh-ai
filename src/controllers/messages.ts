import type { Request, Response } from 'express';
import Document from '../models/document.js';
import Chunk from '../models/chunk.js';
import {createEmbedding} from '../utils/embeddings.js';
import { rankBySimilarity } from '../utils/vector-search.js';
import { buildContext } from '../utils/openai-client.js';
import Chat from '../models/chat.js';
import { askQuestionGetAnswer } from './query.js';
import Message from '../models/message.js';



export const createMessage = async (req: Request, res: Response): Promise<void> => {
  const { question } = req.body;
  const chatId = req.params.id;
  const userId = req.user!.userId;

  // TODO - validate that question is present (400 if not)
if (!question) {
    res.status(400).json({
      success: false,
      data: null,
      error: { message: 'Question required for query'}
    });
    return;
  }
  // TODO - find the chat by _id and userId; send a 404 if not found
const userChat = await Chat.findOne({_id: chatId, userId: userId});
if(!userChat) {
res.status(404).json({
  success: false,
  data: null,
  error: {message: 'Chat not found'}
});
return;
};

  // RAG pipeline — same as queryDocuments
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

  // TODO - call the LLM and extract the answer string (same as queryDocuments)
  const qNA = await askQuestionGetAnswer(question, context)
  // TODO - save the question as a role: 'user' message linked to chatId

  const messageToBot = await Message.create({ role: 'user', chatId: chatId, content: question})
  // TODO - save the answer as an role: 'assistant' message linked to chatId
const messageFromBot = await Message.create({role: 'assistant', chatId: chatId, content: qNA.answer})
  // TODO - return both messages as an array with a 201

  res.status(201).json({
    success: true,
    data: [ messageToBot, messageFromBot],
    error: null
  });
}