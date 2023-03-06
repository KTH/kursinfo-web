'use strict'

import axios from 'axios'

function getCourseEmployees() {
  const ladokRound = this.courseData.roundList[this.activeSemester][this.activeRoundIndex]
  const { round_application_code: applicationCode } = ladokRound
  const data = {
    courseCode: this.courseCode,
    semester: this.activeSemester,
    applicationCodes: [applicationCode],
  }
  return axios.post(this.paths.ug.rest.api.uri, data).then(response => {
    const { examiners, responsibles, teachers } = response.data
    const courseRoundEmployees = {
      examiners,
      responsibles,
      teachers,
    }
    return courseRoundEmployees
  })
}

function addClientFunctionsToWebContext() {
  const functions = {
    getCourseEmployees,
  }
  return functions
}

export { addClientFunctionsToWebContext }
