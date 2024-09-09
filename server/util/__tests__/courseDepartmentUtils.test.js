const { buildCourseDepartmentLink } = require('../courseDepartmentUtils')
const { INFORM_IF_IMPORTANT_INFO_IS_MISSING } = require('../constants')

function htmlStringToElement(html) {
  const template = document.createElement('template')
  template.innerHTML = html
  // eslint-disable-next-line prefer-destructuring
  const htmlElement = template.content.children[0]
  return htmlElement
}

describe('course department link utils', () => {
  test('returns department link', () => {
    const department = { code: 'JH', sv: 'EECS/Datavetenskap', en: 'EECS/Computer Science' }
    const result = buildCourseDepartmentLink(department, 'en')
    expect(result).toBeDefined()

    const element = htmlStringToElement(result)
    expect(element.href).toBe('/eecs/')
    expect(element.innerHTML).toBe('EECS/Computer Science')
  })

  test('returns undefined for Stockholm university as department', () => {
    const department = { code: 'UL', sv: 'Stockholms universitet', en: 'Stockholm University' }

    const result = buildCourseDepartmentLink(department, 'en')
    expect(result).not.toBeDefined()
  })

  test.each([undefined, { name: undefined }])('returns fallback text if department is %p', department => {
    const resultSv = buildCourseDepartmentLink(department, 'sv')
    expect(resultSv).toBe(INFORM_IF_IMPORTANT_INFO_IS_MISSING.sv)

    const resultEn = buildCourseDepartmentLink(department, 'en')
    expect(resultEn).toBe(INFORM_IF_IMPORTANT_INFO_IS_MISSING.en)
  })
})
