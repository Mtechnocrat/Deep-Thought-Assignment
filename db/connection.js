const { MongoClient } = require('mongodb');

const url = 'mongodb+srv://mrgenixx:1234@cluster0.btfne.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const dbName = 'eventDB';
let db;

async function connectToDB() {
  try {
    const client = await MongoClient.connect(url, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });
    db = client.db(dbName);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the process if the connection fails
  }
}

function getDB() {
  if (!db) {
    throw new Error('Database not initialized. Call connectToDB first.');
  }
  return db;
}

module.exports = { connectToDB, getDB };
