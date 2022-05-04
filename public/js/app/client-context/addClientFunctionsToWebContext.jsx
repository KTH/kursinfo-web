'use strict'

import axios from 'axios'

function getCourseEmployees() {
  const ladokRound = this.courseData.roundList[this.activeSemester][this.activeRoundIndex]
  const { roundId: ladokRoundId } = ladokRound
  const data = {
    courseCode: this.courseCode,
    semester: this.activeSemester,
    ladokRoundIds: [ladokRoundId],
  }
  return axios.post(this.paths.redis.ugCache.uri, data).then(response => {
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
