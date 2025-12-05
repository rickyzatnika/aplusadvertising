const { hash } = require('bcryptjs')
const { User } = require('../lib/models/User.js')

async function createTestUser() {
  try {
    console.log('Creating test user...')
    
    const hashedPassword = await hash('password123', 12)
    
    const testUser = {
      name: 'testuser',
      email: 'test@example.com',
      password: hashedPassword,
      role: 'user'
    }
    
    const createdUser = await User.create(testUser)
    console.log('Test user created successfully:', {
      id: createdUser._id,
      name: createdUser.name,
      email: createdUser.email,
      role: createdUser.role
    })
    
  } catch (error) {
    if (error.message.includes('sudah ada')) {
      console.log('Test user already exists')
    } else {
      console.error('Error creating test user:', error.message)
    }
  }
}

// Run the function
if (require.main === module) {
  createTestUser()
    .then(() => {
      console.log('Script completed')
      process.exit(0)
    })
    .catch(error => {
      console.error('Script failed:', error)
      process.exit(1)
    })
}