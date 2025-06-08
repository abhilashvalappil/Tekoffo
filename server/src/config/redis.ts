import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();  

export const redisClient = createClient({
  url: process.env.REDIS_URL  
});

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

(async () => {
  await redisClient.connect();
  console.log('Connected to Redis');
})();

 
