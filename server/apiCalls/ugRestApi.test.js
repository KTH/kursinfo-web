jest.mock('../configuration', () => ({ server: {} }))
jest.mock('@kth/ug-rest-api-helper', () => ({}))

const log = require('@kth/log')
const { getMembersFromGroups } = require('./ugRestApi')

jest.mock('@kth/log')
log.info = jest.fn()
log.debug = jest.fn()
log.error = jest.fn()

const groupData = [
  {
    name: 'edu.courses.SF.SF1624.examiner',
    members: [
      {
        email: 'bichel@kth.se',
        givenName: 'Johannes',
        kthid: 'u13fzqax',
        surname: 'Bichel',
        username: 'bichel',
      },
      {
        email: 'testuge@kth.se',
        givenName: 'Test UG Gruppeditor',
        kthid: 'u11fyan6',
        surname: 'Detectify',
        username: 'testuge',
      },
      {
        email: 'elenara@kth.se',
        emailAddress: 'elenara@kth.se',
        givenName: 'Elena',
        kthid: 'u1ask19i',
        phoneHR: '087906682',
        surname: 'Rakhimova',
        username: 'elenara',
      },
      {
        email: 'bichel@kth.se',
        givenName: 'Johannes',
        kthid: 'u13fzqax',
        surname: 'Bichel',
        username: 'bichel',
      },
    ],
  },
  {
    name: 'edu.courses.SF.SF1624.1.courseresponsible',
    members: [
      {
        givenName: 'sabahat',
        firstName: 'Rao Sabahat Ali',
        lastName: 'Khan',
        surname: 'Khan',
        email: 'sabahat@kth.se',
        username: 'sabahat',
      },
      {
        email: 'madjidi@kth.se',
        emailAddress: 'madjidi@kth.se',
        givenName: 'Payam',
        kthid: 'u1rw2ong',
        phoneHR: '087906673',
        surname: 'Madjidi',
        username: 'madjidi',
      },
      {
        email: 'jeskla@kth.se',
        emailAddress: 'jeskla@kth.se',
        givenName: 'Jessica',
        kthid: 'u16uygcs',
        phoneHR: '087906164',
        surname: 'Klarström',
        username: 'jeskla',
      },
      {
        givenName: 'sabahat',
        firstName: 'Rao Sabahat Ali',
        lastName: 'Khan',
        surname: 'Khan',
        email: 'sabahat@kth.se',
        username: 'sabahat',
      },
    ],
  },
]

describe('Check Examiner and responsilbes with duplicate list', () => {
  test('Passing examiner list and responsible list to check duplicate list', async () => {
    const employeeTestData = getMembersFromGroups(
      groupData,
      ['edu.courses.SF.SF1624.1.assistants'],
      ['edu.courses.SF.SF1624.1.teachers'],
      ['edu.courses.SF.SF1624.examiner'],
      ['edu.courses.SF.SF1624.1.courseresponsible', 'edu.courses.SF.SF1624.2.courseresponsible'],
      'SF1624',
      20222
    )
    const { examiner, teacher, responsibles, assistants } = employeeTestData
    expect(teacher.length).toEqual(0)
    expect(assistants.length).toEqual(0)
    expect(examiner.length).toEqual(3)
    expect(responsibles.length).toEqual(3)
    expect(examiner.filter(x => x.username === 'bichel').length).toEqual(1)
    expect(responsibles.filter(x => x.username === 'sabahat').length).toEqual(1)
  })
})
