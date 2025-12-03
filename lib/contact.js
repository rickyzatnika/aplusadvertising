import { getDb } from './mongodb'

export async function createContact(data) {
  try {
    const db = await getDb()
    const doc = {
      name: data.name,
      email: data.email,
      message: data.message,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    const result = await db.collection('contacts').insertOne(doc)
    const contact = { _id: result.insertedId, ...doc }
    return { success: true, contact }
  } catch (error) {
    console.error('Error creating contact:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to create contact'
    return {
      success: false,
      error: errorMessage,
      details: error instanceof Error ? error.stack : undefined,
    }
  }
}

export async function getAllContacts() {
  try {
    const db = await getDb()
    const contacts = await db.collection('contacts').find().sort({ createdAt: -1 }).toArray()
    return { success: true, contacts }
  } catch (error) {
    console.error('Error fetching contacts:', error)
    return { success: false, error: 'Failed to fetch contacts' }
  }
}

export async function getContactById(id) {
  try {
    const db = await getDb()
    const { ObjectId } = await import('mongodb')
    const contact = await db.collection('contacts').findOne({ _id: new ObjectId(id) })
    return { success: true, contact }
  } catch (error) {
    console.error('Error fetching contact:', error)
    return { success: false, error: 'Failed to fetch contact' }
  }
}

