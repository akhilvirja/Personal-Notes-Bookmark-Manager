import express from "express";
import cors from "cors"

import noteRoutes from './routes/note.routes.js';
import bookmarkRoutes from './routes/bookmark.routes.js';
import authRoutes from './routes/auth.routes.js';

const app = express()


app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/bookmarks', bookmarkRoutes);

export {app}