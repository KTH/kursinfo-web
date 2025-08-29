const { INFORM_IF_IMPORTANT_INFO_IS_MISSING, DEPARTMENT_CODE_STOCKHOLM_UNIVERSITY } = require('./constants')

function isDepartmentStockholmUniversity(courseDepartmentCode) {
  return courseDepartmentCode === DEPARTMENT_CODE_STOCKHOLM_UNIVERSITY
}

function buildCourseDepartmentLink(courseDepartmentName, courseDepartmentCode, language) {
  if (!courseDepartmentName) {
    return INFORM_IF_IMPORTANT_INFO_IS_MISSING[language]
  }

  if (isDepartmentStockholmUniversity(courseDepartmentCode)) {
    return undefined
  }

  const departmentLinkPart = courseDepartmentName.split('/')[0].toLowerCase()
  return `<a href="/${departmentLinkPart}/" target="blank">${courseDepartmentName}</a>`
}

module.exports = {
  buildCourseDepartmentLink,
}
