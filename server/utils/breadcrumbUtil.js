// Logic is based on old Breadcrumb component in kth-reactstrap: https://github.com/KTH/kth-reactstrap/blob/master/src/components/utbildningsinfo/Breadcrumbs.js
// Be aware that this entire file is replicated in multiple apps, so changes here should probably be synced to the other apps.
// See https://confluence.sys.kth.se/confluence/x/6wYJDQ for more information.
const i18n = require('../../i18n')
const baseItems = language => {
  const langIndex = language === 'en' ? 0 : 1
  const { breadCrumbs } = i18n.messages[langIndex]
  return {
    student: {
      url: `${language === 'en' ? '/en' : ''}/student`,
      label: breadCrumbs.student,
    },
    studies: {
      url: `${language === 'en' ? '/en' : ''}/studier`,
      label: breadCrumbs.studies,
    },
    directory: {
      url: `/student/kurser/kurser-inom-program${language === 'en' ? '?l=en' : ''}`,
      label: breadCrumbs.directory,
    },
  }
}

function createAboutCourseItem(language, courseCode) {
  const label = language === 'en' ? 'About course' : 'Om kursen'
  return {
    label: `${label} ${courseCode}`,
    url: `/student/kurser/kurs/${courseCode.toUpperCase()}?l=${language}`,
  }
}

function createBreadcrumbs(language, courseCode) {
  const items = [baseItems(language).student, baseItems(language).studies, baseItems(language).directory]
  if (courseCode) {
    items.push(createAboutCourseItem(language, courseCode))
  }
  return items
}

module.exports = {
  createBreadcrumbs,
}
