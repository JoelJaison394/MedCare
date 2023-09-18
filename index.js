import { startServer } from './server.js';



const server = startServer();

process.on('unhandledRejection', (error) => {

});

process.on('uncaughtException', (error) => {

  server.close(() => {
    process.exit(1);
  });
});
