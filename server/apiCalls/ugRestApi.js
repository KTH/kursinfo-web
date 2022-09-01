const { ugRestApiHelper } = require('@kth/ug-rest-api-helper')
const log = require('@kth/log')
const serverConfig = require('../configuration').server

const groupNames = (courseCode, semester, ladokRoundIds) => ({
  // Used to get examiners and responsibles from UG Redis
  teachers: ladokRoundIds.map(
    round => `edu.courses.${String(courseCode).slice(0, 2)}.${courseCode}.${semester}.${round}.teachers`
  ),
  examiners: [`edu.courses.${String(courseCode).slice(0, 2)}.${courseCode}.examiner`],
  responsibles: ladokRoundIds.map(
    round => `edu.courses.${String(courseCode).slice(0, 2)}.${courseCode}.${semester}.${round}.courseresponsible`
  ),
  assistants: ladokRoundIds.map(
    round => `edu.courses.${String(courseCode).slice(0, 2)}.${courseCode}.${semester}.${round}.assistants`
  ), // edu.courses.SF.SF1624.20191.1.assistants
})

const createPersonHtml = (personList = []) => {
  let personString = ''
  personList.forEach(person => {
    if (person) {
      personString += `<p class = "person">
      <img class="profile-picture" src="https://www.kth.se/files/thumbnail/${
        person.username
      }" alt="Profile picture" width="31" height="31">
      <a href="/profile/${person.username}/" property="teach:teacher">
          ${person.givenName} ${person.lastName ? person.lastName : person.surname} 
      </a> 
    </p>  `
    }
  })
  return personString
}

const getCurrentDateTime = () => {
  const today = new Date()
  const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
  const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()
  const dateTime = date + ' ' + time
  return dateTime
}

const generateEmployeeObjectFromGroups = (groupsAlongWithMembers, assistants, teachers, examiners, responsibles) => {
  // now need to filter groups according to above mentioned groups
  const employee = {}
  if (assistants.length) {
    const assistantGroup = groupsAlongWithMembers.find(x => x.name === assistants[0])
    if (assistantGroup) {
      const flatArrWithHtmlStr = createPersonHtml(assistantGroup.members)
      employee.assistants = flatArrWithHtmlStr
    }
  }
  if (teachers.length) {
    const teachersGroup = groupsAlongWithMembers.find(x => x.name === teachers[0])
    if (teachersGroup) {
      const flatArrWithHtmlStr = createPersonHtml(teachersGroup.members)
      employee.teachers = flatArrWithHtmlStr
    }
  }
  if (examiners.length) {
    const examinersGroup = groupsAlongWithMembers.find(x => x.name === examiners[0])
    if (examinersGroup) {
      const flatArrWithHtmlStr = createPersonHtml(examinersGroup.members)
      employee.examiners = flatArrWithHtmlStr
    }
  }
  if (responsibles.length) {
    const responsiblesGroup = groupsAlongWithMembers.find(x => x.name === responsibles[0])
    if (responsiblesGroup) {
      const flatArrWithHtmlStr = createPersonHtml(responsiblesGroup.members)
      employee.responsibles = flatArrWithHtmlStr
    }
  }
  return employee
}

/**
 * This will first prepare filter query then pass that query to ug rest api and then return groups data along with members.
 * @param assistants Assistants group name
 * @param teachers Teachers group name
 * @param examiners Examiners group name
 * @param responsibles Responsibles group name
 * @returns Will return groups along with members from ug rest api.
 */
async function getAllGroupsAlongWithMembersRelatedToCourse(assistants, teachers, examiners, responsibles) {
  const { url, key } = serverConfig.ugRestApiURL
  const { authTokenURL, authClientId, authClientSecret } = serverConfig.ugAuth
  const ugConnectionProperties = {
    ugTokenURL: authTokenURL,
    clientId: authClientId,
    clientSecret: authClientSecret,
    ugURL: url,
    subscriptionKey: key,
  }
  ugRestApiHelper.initConnectionProperties(ugConnectionProperties)
  const filterData = []
  if (assistants.length) {
    filterData.push(assistants[0])
  }
  if (teachers.length) {
    filterData.push(teachers[0])
  }
  if (examiners.length) {
    filterData.push(examiners[0])
  }
  if (responsibles.length) {
    filterData.push(responsibles[0])
  }
  log.info('Started fetching data of groups along with members from UG Rest Api at ', getCurrentDateTime())
  log.info('Fetching groups along with members')
  log.info('Using Filter Query Data', { filterData })
  log.info('Using Filter Operator:', 'in')
  const groupDetails = await ugRestApiHelper.getUGGroups('name', 'in', filterData, true)
  log.info('Successfully fetched data of groups along with members from UG Rest Api at ', getCurrentDateTime())
  log.info('Successfully fetched groups data along with members')
  log.info('Filter Query Data Used', { filterData })
  log.info('Filter Operator Used :', 'in')
  return groupDetails
}

// ------- EXAMINATOR AND RESPONSIBLES FROM UG-REST_API: ------- /
async function _getCourseEmployees(apiMemoData) {
  const { courseCode, semester, ladokRoundIds } = apiMemoData
  try {
    const { assistants, teachers, examiners, responsibles } = groupNames(courseCode, semester, ladokRoundIds)
    log.debug(
      '_getEmployeeObject for with key(s): ',
      assistants.length ? assistants : '',
      teachers.length ? teachers : '',
      examiners.length ? examiners : '',
      responsibles.length ? responsibles : ''
    )
    // get all groups along with member of given course code from UG Rest Api
    const groupsAlongWithMembers = await getAllGroupsAlongWithMembersRelatedToCourse(
      assistants,
      teachers,
      examiners,
      responsibles
    )
    return generateEmployeeObjectFromGroups(groupsAlongWithMembers, assistants, teachers, examiners, responsibles)
  } catch (err) {
    log.info('Exception from UG Rest API - multi', { error: err })
    return err
  }
}

module.exports = {
  getCourseEmployees: _getCourseEmployees,
}
