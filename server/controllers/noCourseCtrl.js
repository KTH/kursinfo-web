'use strict'



module.exports = {
  getIndex: getIndex
}

 function  getIndex (req, res, next) {
    res.render('noCourse/index', {
      debug: 'debug' in req.query,
      html:html
    ,initialState: "Ingen kurskod"
    })
}


