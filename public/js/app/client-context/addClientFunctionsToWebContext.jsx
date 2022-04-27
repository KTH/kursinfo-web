'use strict'

import axios from 'axios'

function getCourseEmployees() {
  const ladokRound = this.courseData.roundList[this.activeSemester][this.activeRoundIndex]
  const ladokRoundId = ladokRound.roundId
  const data = {
    courseCode: this.courseCode,
    semester: this.activeSemester,
    ladokRoundIds: [ladokRoundId],
  }
  axios.post(this.paths.redis.ugCache.uri, data).then(response => {
    const { examiners, responsibles, teachers } = response.data
    this.roundData = {
      examiners,
      responsibles,
      teachers,
    }
  })
}

function addClientFunctionsToWebContext() {
  const functions = {
    getCourseEmployees,
  }
  return functions
}

export { addClientFunctionsToWebContext }
