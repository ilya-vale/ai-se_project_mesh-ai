import { Router } from "express";
import { uploadDoc, getDocsForCurrentUser, getDocById, deleteDoc } from "../controllers/documents.js";
import { auth } from '../middleware/auth.js';
import multer from 'multer';

const docsRouter = Router();
docsRouter.use(auth);

const upload = multer({ dest: 'uploads/' });
 docsRouter.post('/', upload.single('file'), uploadDoc);
docsRouter.get("/", getDocsForCurrentUser);
docsRouter.get("/:id", getDocById);
docsRouter.delete("/:id", deleteDoc);



export { docsRouter };