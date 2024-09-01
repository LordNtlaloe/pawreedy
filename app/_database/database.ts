import { MongoClient } from 'mongodb';


export const connectToDB = async () => {
  try {
    const client = new MongoClient(process.env.DATABASE_URI as string);
    const dbConnection = await client.connect();
    console.log('Connection established...');
    
    return dbConnection;
  } catch (error:any) {
    console.log('INIT: Failed to connect to DB..', error.message);
    return;
  }
};