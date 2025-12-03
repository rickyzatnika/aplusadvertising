import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI || process.env.DATABASE_URL

if (!uri) {
  console.warn('[mongodb] MONGODB_URI (or DATABASE_URL) is not set. DB will not be available.')
}

let client
let clientPromise

if (!global._mongoClientPromise) {
  client = new MongoClient(uri || 'mongodb://localhost:27017')
  global._mongoClientPromise = client.connect()
}

clientPromise = global._mongoClientPromise

export async function getDb(dbName = process.env.MONGODB_DB || 'appdb') {
  const conn = await clientPromise
  return conn.db(dbName)
}
