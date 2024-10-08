require('dotenv').config();

const mongoose = require('mongoose');
const uri = process.env.DB_NAME;

export async function connectDB(): Promise<void> {
  try {
      const conn = await mongoose.connect(uri || '');
      console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
      console.error(`Error: ${error.message}`);
      process.exit(1); 
  }
}