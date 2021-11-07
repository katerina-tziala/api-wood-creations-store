import express, { Request, Response } from 'express';
import cors from 'cors';
import { PORT } from './config/config';

const app = express();
const startedAt = new Date().toUTCString();

app.use(cors());
app.use(express.json());

app.get('/', async (_, res: Response): Promise<void> => {
  res.status(200).send(`Server up and running. Server started at ${startedAt}`);
});


app.listen(PORT, () => {
  // prettier-ignore
  // eslint-disable-next-line
  console.log(
    '\x1b[36m%s\x1b[0m',
    `Server running at http://localhost:${PORT}`
  );
});

export default app;
