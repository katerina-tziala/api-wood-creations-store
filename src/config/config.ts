import dotenv from 'dotenv';
dotenv.config();

export const PORT = parseInt(process.env.PORT as unknown as string, 10);
