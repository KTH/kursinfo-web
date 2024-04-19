'use strict'

import axios from 'axios'

async function getCourseEmployees(selectedSemester, selectedRoundIndex) {
  const roundsInSemester = this.courseData.roundList[selectedSemester]
  const ladokRound = roundsInSemester[selectedRoundIndex]
  const { round_application_code: applicationCode } = ladokRound
  const data = {
    courseCode: this.courseCode,
    semester: selectedSemester,
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
