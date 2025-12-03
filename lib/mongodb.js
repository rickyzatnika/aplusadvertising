import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI || process.env.DATABASE_URL

if (!uri) {
  console.warn('[mongodb] MONGODB_URI (or DATABASE_URL) is not set. Skipping DB connection initialization.')
}

let client
let clientPromise

if (uri) {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
}

export async function getDb(dbName = process.env.MONGODB_DB || 'appdb') {
  if (!uri || !clientPromise) {
    throw new Error('Database not configured')
  }
  const conn = await clientPromise
  return conn.db(dbName)
}
