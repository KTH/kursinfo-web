'use strict'

import { observable, action } from 'mobx'
import axios from 'axios'

class RouterStore {
  @observable courseCode = ''

  @observable useStartSemesterFromQuery = false

  @observable hasStartPeriodFromQuery = false

  @observable sellingText = { en: '', sv: '' }

  @observable imageFromAdmin = ''

  @observable showCourseWebbLink = true

  @observable memoList = {}

  @observable isCancelled = false

  @observable isDeactivated = false

  @observable keyList = {
    teachers: [],
    responsibles: []
  }

  @observable activeSemesters = []

  @observable roundsSyllabusIndex = []

  @observable defaultIndex = 0

  @observable activeRoundIndex = 0

  @observable activeSemesterIndex = 0

  @observable activeSemester = 0

  @observable activeSyllabusIndex = 0

  @observable dropdownsOpen = {
    roundsDropdown: false,
    semesterDropdown: false
  }

  @observable roundInfoFade = false

  @observable syllabusInfoFade = false

  @observable showRoundData = false

  @observable roundDisabled = false

  @observable roundSelected = false

  @observable semesterSelectedIndex = 0

  @observable roundSelectedIndex = 0

  @observable courseData = {
    courseInfo: {
      course_application_info: []
    },
    syllabusSemesterList: []
  }

  @observable roundData = {}

  @action getCourseEmployees = () => {
    const ladokRound = this.courseData.roundList[this.activeSemester][this.activeRoundIndex]
    const ladokRoundId = ladokRound.roundId
    const data = {
      courseCode: this.courseCode,
      semester: this.activeSemester,
      ladokRoundIds: [ladokRoundId]
    }
    axios.post(this.paths.redis.ugCache.uri, data).then((response) => {
      const { examiners, responsibles, teachers } = response.data
      this.roundData = {
        examiners,
        responsibles,
        teachers
      }
    })
  }

  @action setBrowserConfig(config, paths, apiHost, profileBaseUrl) {
    this.browserConfig = config
    this.paths = paths
    this.apiHost = apiHost
    this.profileBaseUrl = profileBaseUrl
  }

  initializeStore(storeName) {
    const store = this

    if (typeof window !== 'undefined' && window.__initialState__ && window.__initialState__[storeName]) {
      const tmp = JSON.parse(decodeURIComponent(window.__initialState__[storeName]))

      Object.keys(tmp).map((key) => {
        store[key] = tmp[key]
        delete tmp[key]
      })

      // Just a nice helper message
      if (Object.keys(window.__initialState__).length === 0) {
        window.__initialState__ = 'Mobx store state initialized'
      }

      require('../../../../node_modules/kth-style/dist/js/menus')
      require('../../../../node_modules/kth-style/dist/js/backtotop')
    }
  }
}

export default RouterStore
