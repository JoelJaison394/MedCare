import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { vault , audit } from './pangeaConfig.js';
import cors from 'cors'

dotenv.config();


import userRoute from './routes/userRoutes.js'
import fileuploadRoute from './routes/fileuploadRoute.js'

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());
app.use(cors())

app.get('/', (req, res) => {
  res.send('Welcome to Medcare API');
});

const baseRoute = "/api";
app.use(baseRoute, userRoute);
app.use(baseRoute, fileuploadRoute);

export const startServer = () => {
  if (vault && audit ) {
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    process.on('SIGTERM', () => {
      console.log('Received SIGTERM. Closing server...');
      server.close(() => {
        console.log('Server closed.');
        process.exit(0);
      });
    });

    return server;
  } else {
    console.error('Pangea is not connected or operational.');
    process.exit(1);
  }
};
  
  
  
  
  
  
