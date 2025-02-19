'use strict'

const api = require('../api')
const SOCIAL_USER_API = process.env.SOCIAL_USER_URI
const SOCIAL_KEY = process.env.SOCIAL_KEY

export async function getSocial(user, endpoint, language) {
  return (await got.get)(`${SOCIAL_USER_API}/${user.kthid}/${endpoint}.json`, {
    headers: {
      authorization: SOCIAL_KEY,
      'Accept-Language': language || 'en',
    },
    responseType: 'json',
  }).then(r => r.body)
}

module.exports = {
  getSocial,
}
