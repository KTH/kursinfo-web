const breadcrumbLinks = {
  university: { en: 'https://www.kth.se/en', sv: 'https://www.kth.se/' },
  student: { en: 'https://www.kth.se/en/student', sv: 'https://www.kth.se/student' },
  directory: {
    en: 'https://www.kth.se/student/kurser/kurser-inom-program?l=en',
    sv: 'https://www.kth.se/student/kurser/kurser-inom-program'
  }
}

function aboutCourseLink (courseCode, language) {
  const languageParameter = language === 'en' ? '?l=en' : ''
  return `https://www.kth.se/student/kurser/kurs/${courseCode}${languageParameter}`
}

module.exports = {
  breadcrumbLinks,
  aboutCourseLink
}
