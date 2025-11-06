import mongoose from 'mongoose';
import { env } from '../config/env.js';

export async function connectMongo() {
  if (!env.mongoUri) throw new Error('MONGO_URI missing');

  mongoose.set('strictQuery', true);

  await mongoose.connect(env.mongoUri, {
    dbName: 'adventurersGuild',   // 👈 force the exact, lowercase name
    autoIndex: true
  });

  console.log('Mongo connected to db:', mongoose.connection.name);
  return mongoose.connection;
}
