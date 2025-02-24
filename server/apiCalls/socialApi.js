'use strict'

const axios = require('axios')

const SOCIAL_USER_API = process.env.SOCIAL_USER_URI

async function getSocial(courseCode, language) {
  try {
    const response = await axios.get(`${SOCIAL_USER_API}/${courseCode}/schedules.json`, {
      headers: {
        'Accept-Language': language || 'en',
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching social data:', error)
    throw error // Re-throwing the error to handle it where the function is called
  }
}

module.exports = {
  getSocial,
}
