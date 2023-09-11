import { startServer } from './server.js';
import logger from './logger.js'; 
import dotenv from 'dotenv';
dotenv.config();


const server = startServer();


process.on('unhandledRejection', (error) => {
  logger.error('Unhandled Promise Rejection:', error);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  server.close(() => {
    process.exit(1);
  });
});
