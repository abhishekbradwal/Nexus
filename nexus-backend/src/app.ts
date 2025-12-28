import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './common/middleware/errorHandler';
import { requestLogger } from './common/middleware/requestLogger';
import { requestIdMiddleware } from './common/middleware/requestId';
import { corsOptions } from './common/middleware/cors';
import { asyncHandler } from './common/utils/asyncHandler';
import routes from './routes';
import { NotFoundError } from './common/errors/NotFoundError';

const app: Express = express();

// Security Middleware
app.use(helmet());
app.use(cors(corsOptions));

// Request ID Middleware
app.use(requestIdMiddleware);

// Body Parser Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Logging Middleware
app.use(morgan('combined'));
app.use(requestLogger);

// Health Check Route
// Health Check Route
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});


// API Routes
app.use('/api', routes);

// 404 Handler
app.use((req, res, next) => {
  const error = new NotFoundError('Route not found');
  next(error);
});

// Global Error Handler
app.use(errorHandler);

export default app;