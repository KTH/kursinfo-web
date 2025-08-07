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
    const departmentName = 'EECS/Computer Science'
    const departmentCode = 'JH'
    const result = buildCourseDepartmentLink(departmentName, departmentCode, 'en')
    expect(result).toBeDefined()

    const element = htmlStringToElement(result)
    expect(element.href).toBe('/eecs/')
    expect(element.innerHTML).toBe('EECS/Computer Science')
  })

  test('returns undefined for Stockholm university as department', () => {
    const departmentName = 'Stockholms universitet'
    const departmentCode = 'UL'

    const result = buildCourseDepartmentLink(departmentName, departmentCode, 'en')
    expect(result).not.toBeDefined()
  })

  test.each([
    [undefined, undefined],
    [undefined, undefined],
  ])('returns fallback text if departmentName: %p and departmentCode: %p', (departmentName, departmentCode) => {
    const resultSv = buildCourseDepartmentLink(departmentName, departmentCode, 'sv')
    expect(resultSv).toBe(INFORM_IF_IMPORTANT_INFO_IS_MISSING.sv)

    const resultEn = buildCourseDepartmentLink(departmentName, departmentCode, 'en')
    expect(resultEn).toBe(INFORM_IF_IMPORTANT_INFO_IS_MISSING.en)
  })
})
