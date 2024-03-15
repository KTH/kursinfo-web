const breadcrumbLinks = {
  university: { en: '/en', sv: '/' },
  student: { en: '/en/student', sv: '/student' },
  directory: {
    en: '/student/kurser/kurser-inom-program?l=en',
    sv: '/student/kurser/kurser-inom-program',
  },
}

function aboutCourseLink(courseCode, language) {
  const languageParameter = language === 'en' ? '?l=en' : ''
  return `/student/kurser/kurs/${courseCode}${languageParameter}`
}

module.exports = {
  breadcrumbLinks,
  aboutCourseLink,
}
