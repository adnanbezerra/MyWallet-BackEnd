import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const MONGO = process.env.MONGO_CONNECTION;

// Conexão com o banco de dados
const mongoClient = new MongoClient(MONGO);
let db;
mongoClient.connect().then(() => {
    db = mongoClient.db("mywallet")
})

export default db;