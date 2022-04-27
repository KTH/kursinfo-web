'use strict'

function getIndex(req, res, next) {
  const html = 'Something got wrong...'
  res.render('noCourse/index', {
    debug: 'debug' in req.query,
    html,
    initialState: 'Ingen kurskod',
  })
}

module.exports = {
  getIndex,
}
