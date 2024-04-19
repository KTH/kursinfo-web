'use strict'

const ugRestApi = require('../apiCalls/ugRestApi')

async function getCourseEmployees(req, res) {
  const apiMemoData = req.body
  const courseEmployees = await ugRestApi.getCourseEmployees(apiMemoData)
  res.send(courseEmployees)
}

module.exports = {
  getCourseEmployees,
}
