const { ugRestApiHelper } = require('@kth/ug-rest-api-helper')
const log = require('@kth/log')
const serverConfig = require('../configuration').server

const _getOrgPart = courseCode => {
  if (courseCode.length === 7) return courseCode.slice(0, 3)
  if (courseCode.length === 6) return courseCode.slice(0, 2)
  return undefined
}

const _getNumberPart = courseCode => {
  if (courseCode.length === 7) return courseCode.slice(3)
  if (courseCode.length === 6) return courseCode.slice(2)
  return undefined
}

const _groupNames = (courseCode, semester, applicationCodes) => {
  const courseOrgPart = _getOrgPart(courseCode)
  const courseNumberPart = _getNumberPart(courseCode)

  return {
    // Used to get examiners, teachers and course coordinators from UG Redis
    course: [`ladok2.kurser.${courseOrgPart}.${courseNumberPart}`],
    courseRound: applicationCodes.map(
      applicationCode => `ladok2.kurser.${courseOrgPart}.${courseNumberPart}.${semester}.${applicationCode}`
    ),
  }
}

const _createPersonHtml = (personList = []) => {
  let personString = ''
  personList.forEach(person => {
    if (person) {
      personString += `<p class="person">
      <img class="profile-picture" src="https://www.kth.se/files/thumbnail/${
        person.username
      }" alt="Profile picture" width="31" height="31">
      <a href="/profile/${person.username}/" property="teach:teacher">
          ${person.givenName} ${person.surname} 
      </a> 
    </p>`
    }
  })
  return personString
}

const _getAllGroups = (courseGroups, courseRoundGroups) => {
  const groups = []
  if (courseGroups.length) {
    courseGroups.forEach(courseGroup => {
      groups.push(courseGroup)
    })
  }
  if (courseRoundGroups.length) {
    courseRoundGroups.forEach(courseRoundGroup => {
      groups.push(courseRoundGroup)
    })
  }
  return groups
}

const _getEmployeeObject = (examiners, teachers, courseCoordinators) => {
  const employee = {}
  if (examiners && examiners.length > 0) {
    employee.examiners = _createPersonHtml(examiners)
  }
  if (teachers && teachers.length > 0) {
    employee.teachers = _createPersonHtml(teachers)
  }
  if (courseCoordinators && courseCoordinators.length > 0) {
    employee.courseCoordinators = _createPersonHtml(courseCoordinators)
  }
  return employee
}

const _getCurrentDateTime = () => {
  const today = new Date()
  const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
  const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()
  const dateTime = date + ' ' + time
  return dateTime
}

/**
 * Initialize connection properties for UG REST API.
 */
function _initializeUGConnection() {
  const { url, key } = serverConfig.ugRestApiURL
  const { authTokenURL, authClientId, authClientSecret } = serverConfig.ugAuth

  const connectionProperties = {
    authorityURL: authTokenURL,
    clientId: authClientId,
    clientSecret: authClientSecret,
    ugURL: url,
    subscriptionKey: key,
  }

  ugRestApiHelper.initConnectionProperties(connectionProperties)
}

/**
 * Fetches group data along with attributes from the UG REST API.
 * @param {string[]} courseGroups - Course group name.
 * @param {string[]} courseRoundGroups - Course round group names.
 * @param {string} courseCode - Course code, used for logging.
 * @param {string} semester - Semester, used for logging.
 * @returns {Promise<Object[]>} Group details with attributes.
 */
async function _getGroupsWithAttributes(courseGroups, courseRoundGroups, courseCode, semester) {
  _initializeUGConnection()

  const groups = _getAllGroups(courseGroups, courseRoundGroups)

  log.info('Fetching course and course round groups with attributes', {
    courseCode,
    semester,
    requestStartTime: _getCurrentDateTime(),
  })

  const groupDetails = await ugRestApiHelper.getUGGroups('name', 'in', groups, false)

  log.info('Fetched course and course round groups with attributes successfully', {
    courseCode,
    semester,
    requestEndTime: _getCurrentDateTime(),
  })

  return groupDetails
}

/**
 * Fetches users from group attributes by KTH ID.
 * @param {Object[]} groupsWithAttributes - List of groups with role-based attributes.
 * @param {string} courseCode - Course code, used for logging.
 * @param {string} semester - Semester, used for logging.
 * @returns {Promise<Object>} Object containing arrays of users categorized by role.
 */
async function _getUsersFromGroupAttributes(groupsWithAttributes, courseCode, semester) {
  _initializeUGConnection()

  const usersByRole = {
    examiners: [],
    teachers: [],
    courseCoordinators: [],
  }

  log.info('Fetching users from group attributes (KTH IDs)', {
    courseCode,
    semester,
    requestStartTime: _getCurrentDateTime(),
  })

  for (const group of groupsWithAttributes) {
    await Promise.all(
      Object.keys(usersByRole).map(async role => {
        const kthIds = group[role]
        if (!Array.isArray(kthIds)) return // Skip undefined or invalid roles

        const userPromises = kthIds.map(kthId => ugRestApiHelper.getUGUsers('kthid', 'eq', kthId))
        const usersPerRole = await Promise.all(userPromises)
        usersByRole[role].push(...usersPerRole.flat())
      })
    )
  }

  log.info('Fetched users from group attributes successfully', {
    courseCode,
    semester,
    requestEndTime: _getCurrentDateTime(),
  })

  return usersByRole
}

async function getCourseEmployees({ courseCode, semester, applicationCodes = [] }) {
  try {
    const { course: courseGroups, courseRound: courseRoundGroups } = _groupNames(courseCode, semester, applicationCodes)

    // get all groups along with attributes from UG Rest Api
    const groupsAlongWithAttributes = await _getGroupsWithAttributes(
      courseGroups,
      courseRoundGroups,
      courseCode,
      semester
    )
    // get all users based on above attributes from UG Rest Api
    const { examiners, teachers, courseCoordinators } = await _getUsersFromGroupAttributes(
      groupsAlongWithAttributes,
      courseCode,
      semester
    )

    return _getEmployeeObject(examiners, teachers, courseCoordinators)
  } catch (err) {
    log.info('Exception from UG Rest API - multi', { error: err })
    return err
  }
}

module.exports = {
  getCourseEmployees,
}
