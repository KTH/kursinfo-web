const { INFORM_IF_IMPORTANT_INFO_IS_MISSING, DEPARTMENT_CODE_STOCKHOLM_UNIVERSITY } = require('./constants')

function isDepartmentStockholmUniversity(courseDepartment) {
  return courseDepartment.code === DEPARTMENT_CODE_STOCKHOLM_UNIVERSITY
}

function buildCourseDepartmentLink(courseDepartment, language) {
  const name = courseDepartment && courseDepartment[language]
  if (!name) {
    return INFORM_IF_IMPORTANT_INFO_IS_MISSING[language]
  }

  if (isDepartmentStockholmUniversity(courseDepartment)) {
    return undefined
  }

  const departmentLinkPart = name.split('/')[0].toLowerCase()
  return `<a href="/${departmentLinkPart}/" target="blank">${name}</a>`
}

module.exports = {
  buildCourseDepartmentLink,
}
