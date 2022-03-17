const serverConfig = require('../configuration').server
const redis = require('kth-node-redis')
const log = require('@kth/log')

const redisKeys = (courseCode, semester, ladokRoundIds) => {
  // Used to get examiners and responsibles from UG Rdedis
  return {
    teachers: ladokRoundIds.map((round) => `${courseCode}.${semester}.${round}.teachers`),
    examiners: [`${courseCode}.examiner`],
    responsibles: ladokRoundIds.map((round) => `${courseCode}.${semester}.${round}.courseresponsible`),
    assistants: ladokRoundIds.map((round) => `${courseCode}.${semester}.${round}.assistants`) // edu.courses.SF.SF1624.20191.1.assistants
  }
}

const _removeDublicates = (personListWithDublicates) =>
  personListWithDublicates
    .map((person) => JSON.stringify(person))
    .filter((person, index, self) => self.indexOf(person) === index)
    .map((personStr) => JSON.parse(personStr))

const createPersonHtml = (personList = []) => {
  let personString = ''
  personList.forEach((person) => {
    if (person) {
      personString += `<p class = "person">
      <img class="profile-picture" src="https://www.kth.se/files/thumbnail/${person.username}" alt="Profile picture" width="31" height="31">
      <a href="/profile/${person.username}/" property="teach:teacher">
          ${person.givenName} ${person.lastName} 
      </a> 
    </p>  `
    }
  })
  return personString
}

// ------- EXAMINATOR AND RESPONSIBLES FROM UG-REDIS: ------- /
async function _getCourseEmployees(apiMemoData) {
  const { courseCode, semester, ladokRoundIds } = apiMemoData
  try {
    const { assistants, teachers, examiners, responsibles } = redisKeys(courseCode, semester, ladokRoundIds)
    log.debug(
      '_getCourseEmployees for with key(s): ',
      assistants.length ? assistants : '',
      teachers.length ? teachers : '',
      examiners.length ? examiners : '',
      responsibles.length ? responsibles : ''
    )

    const employeeIndex = new Map()
    const ugClient = await redis('ugRedis', serverConfig.cache.ugRedis.redis)
    let apiCall = ugClient.multi()
    if (teachers.length) {
      apiCall = apiCall.mget(teachers)
      employeeIndex.set('teachers', 0)
    }
    if (examiners.length) {
      apiCall = apiCall.mget(examiners)
      employeeIndex.set('examiners', employeeIndex.size)
    }
    if (responsibles.length) {
      apiCall = apiCall.mget(responsibles)
      employeeIndex.set('responsibles', employeeIndex.size)
    }
    if (assistants.length) {
      apiCall = apiCall.mget(assistants)
      employeeIndex.set('assistants', employeeIndex.size)
    }
    const arrWithStringifiedArrays = await apiCall.execAsync()
    log.debug('Ug Redis fetched correctly', arrWithStringifiedArrays)
    const flatArrWithHtmlStr = arrWithStringifiedArrays.map((perTypeStringifiedArr) => {
      const thisTypeAllRoundsEmployees = perTypeStringifiedArr.flatMap((perRoundStr) => JSON.parse(perRoundStr))
      /* Remove duplicates */
      const deepDistinctEmpoyeesNoDublicates = _removeDublicates(thisTypeAllRoundsEmployees)
      return createPersonHtml(deepDistinctEmpoyeesNoDublicates)
    })

    const employees = {}
    if (employeeIndex.has('teachers')) {
      employees.teachers = flatArrWithHtmlStr[employeeIndex.get('teachers')]
    }
    if (employeeIndex.has('examiners')) {
      employees.examiners = flatArrWithHtmlStr[employeeIndex.get('examiners')]
    }
    if (employeeIndex.has('responsibles')) {
      employees.responsibles = flatArrWithHtmlStr[employeeIndex.get('responsibles')]
    }
    if (employeeIndex.has('assistants')) {
      employees.assistants = flatArrWithHtmlStr[employeeIndex.get('assistants')]
    }
    return employees
  } catch (err) {
    log.error('Exception from ugRedis - multi', { error: err })
    return err
  }
}

module.exports = {
  getCourseEmployees: _getCourseEmployees
}
