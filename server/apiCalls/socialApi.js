'use strict'

const axios = require('axios')

async function getSocial(courseCode, language) {
  try {
    const response = await axios.get(`${process.env.SOCIAL_API_URI}/${courseCode}/schedules.json`, {
      headers: {
        'Accept-Language': language || 'en',
      },
    })
    return response.data
  } catch (error) {
    throw new Error(`Failed to fetch from social api. Error: ${error}`)
  }
}

module.exports = {
  getSocial,
}
