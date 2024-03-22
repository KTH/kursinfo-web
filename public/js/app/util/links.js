function aboutCourseLink(courseCode, language) {
  const languageParameter = language === 'en' ? '?l=en' : ''
  return `/student/kurser/kurs/${courseCode}${languageParameter}`
}

module.exports = {
  aboutCourseLink,
}
