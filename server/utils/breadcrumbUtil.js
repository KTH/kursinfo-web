// Logic is based on old Breadcrumb component in kth-reactstrap: https://github.com/KTH/kth-reactstrap/blob/master/src/components/utbildningsinfo/Breadcrumbs.js
// Be aware that this entire file is replicated in multiple apps, so changes here should probably be synced to the other apps.
// See https://confluence.sys.kth.se/confluence/x/6wYJDQ for more information.
const baseItems = {
  university: {
    en: { url: '/en', label: 'KTH' },
    sv: { url: '/', label: 'KTH' },
  },
  student: {
    en: { url: '/en/student', label: 'Student at KTH' },
    sv: { url: '/student', label: 'Student på KTH' },
  },
  directory: {
    en: { url: '/student/kurser/kurser-inom-program?l=en', label: 'Course and programme directory' },
    sv: { url: '/student/kurser/kurser-inom-program', label: 'Kurs- och programkatalogen' },
  },
}

function createAboutCourseItem(language, courseCode) {
  const label = language === 'en' ? 'About course' : 'Om kursen'
  return {
    label: `${label} ${courseCode}`,
    url: `/student/kurser/kurs/${courseCode.toUpperCase()}?l=${language}`,
  }
}

function createBreadcrumbs(language, courseCode) {
  const items = [baseItems.university[language], baseItems.student[language], baseItems.directory[language]]
  if (courseCode) {
    items.push(createAboutCourseItem(language, courseCode))
  }
  return items
}

module.exports = {
  createBreadcrumbs,
}
