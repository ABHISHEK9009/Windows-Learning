import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import errorHandler from './middleware/errorHandler.js';
import authRoutes from './modules/auth/auth.routes.js';
import userRoutes from './modules/users/user.routes.js';
import mentorRoutes from './modules/mentors/mentor.routes.js';
import sessionRoutes from './modules/sessions/session.routes.js';
import walletRoutes from './modules/wallet/wallet.routes.js';
import requirementRoutes from './modules/requirements/requirement.routes.js';
import proposalRoutes from './modules/proposals/proposal.routes.js';
import reviewRoutes from './modules/reviews/review.routes.js';
import analyticsRoutes from './modules/analytics/analytics.routes.js';
import categoryRoutes from './modules/categories/category.routes.js';
import chatRoutes from './modules/chat/chat.routes.js';
import aiRoutes from './modules/ai/ai.routes.js';
import mentorProfileRoutes from './routes/mentorProfileRoutes.js';
import reviewSystemRoutes from './routes/reviewRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Versioning - v1
const API_V1 = '/api/v1';

app.use(`${API_V1}/auth`, authRoutes);
app.use(`${API_V1}/users`, userRoutes);
app.use(`${API_V1}/mentors`, mentorRoutes);
app.use(`${API_V1}/sessions`, sessionRoutes);
app.use(`${API_V1}/wallet`, walletRoutes);
app.use(`${API_V1}/requirements`, requirementRoutes);
app.use(`${API_V1}/proposals`, proposalRoutes);
app.use(`${API_V1}/reviews`, reviewRoutes);
app.use(`${API_V1}/analytics`, analyticsRoutes);
app.use(`${API_V1}/categories`, categoryRoutes);
app.use(`${API_V1}/chat`, chatRoutes);
app.use(`${API_V1}/ai`, aiRoutes);
app.use(`${API_V1}/mentor-profiles`, mentorProfileRoutes);
app.use(`${API_V1}/review-system`, reviewSystemRoutes);

// Centralized Error Handling
app.use(errorHandler);

export default app;
