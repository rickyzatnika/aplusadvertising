import { getDb } from '@/lib/mongodb'

import { ObjectId } from 'mongodb'

export class User {
  static async findOne(query) {
    try {
      const db = await getDb()
      const users = db.collection('users')
      return await users.findOne(query)
    } catch (error) {
      console.error('[User.findOne] Error:', error)
      throw error
    }
  }

  static async findById(id) {
    try {
      const db = await getDb()
      const users = db.collection('users')
      // ObjectId sudah di-import di atas
      return await users.findOne({ _id: new ObjectId(id) })
    } catch (error) {
      console.error('[User.findById] Error:', error)
      throw error
    }
  }

  static async create(userData) {
    try {
      const db = await getDb()
      const users = db.collection('users')
      
      // Check if user already exists
      const existingUser = await users.findOne({ 
        $or: [
          { email: userData.email },
          { name: userData.name }
        ]
      })
      
      if (existingUser) {
        throw new Error('User dengan email atau username ini sudah ada')
      }

      // Add timestamps
      const userWithTimestamps = {
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const result = await users.insertOne(userWithTimestamps)
      return { ...userWithTimestamps, _id: result.insertedId }
    } catch (error) {
      console.error('[User.create] Error:', error)
      throw error
    }
  }

  static async updateOne(query, update) {
    try {
      const db = await getDb()
      const users = db.collection('users')
      
      // Add updatedAt timestamp
      const updateWithTimestamp = {
        ...update,
        $set: {
          ...update.$set,
          updatedAt: new Date()
        }
      }

      return await users.updateOne(query, updateWithTimestamp)
    } catch (error) {
      console.error('[User.updateOne] Error:', error)
      throw error
    }
  }

  static async deleteOne(query) {
    try {
      const db = await getDb()
      const users = db.collection('users')
      return await users.deleteOne(query)
    } catch (error) {
      console.error('[User.deleteOne] Error:', error)
      throw error
    }
  }
}