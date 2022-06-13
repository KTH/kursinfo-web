'use strict'

function setBrowserConfig(config, paths, hostUrl) {
  this.browserConfig = config
  this.paths = paths
  this.hostUrl = hostUrl
}

function createServerSideContext() {
  const context = {
    courseCode: '',
    useStartSemesterFromQuery: false,
    hasStartPeriodFromQuery: false,
    sellingText: { en: '', sv: '' },
    imageFromAdmin: '',
    showCourseWebbLink: true,
    memoList: {},
    isCancelled: false,
    isDeactivated: false,
    keyList: {
      teachers: [],
      responsibles: [],
    },
    activeSemesters: [],
    activeSemestersIndexesWithValidSyllabusesIndexes: [],
    defaultIndex: 0,
    activeRoundIndex: 0,
    activeSemesterIndex: 0,
    activeSemester: 0,
    activeSyllabusIndex: 0,
    dropdownsOpen: {
      roundsDropdown: false,
      semesterDropdown: false,
    },
    roundInfoFade: false,
    syllabusInfoFade: false,
    showRoundData: false,
    roundDisabled: false,
    semesterSelectedIndex: 0,
    roundSelectedIndex: 0,
    courseData: {
      courseInfo: {
        course_application_info: [],
      },
      syllabusSemesterList: [],
    },
    setBrowserConfig,
  }
  return context
}

module.exports = { createServerSideContext }
