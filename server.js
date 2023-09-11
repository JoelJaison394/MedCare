import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(helmet());

app.get('/', (req, res) => {
  res.send('Welcome to Medcare API');
});

export const startServer = () => {
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
  };
  
  
  
  
  
  
