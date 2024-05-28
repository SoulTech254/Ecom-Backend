import dotenv from 'dotenv';

dotenv.config();

const secretKey = process.env.SECRET_KEY;

if (!secretKey) {
  throw new Error('SECRET_KEY is not defined in the environment variables');
}


export default secretKey;
