const { createPlannedModularString } = require('../createPlannedModularString')

describe('createPlannedModularString', () => {
  test('returns empty string if empty modules', () => {
    expect(createPlannedModularString([])).toStrictEqual('')
  })

  test('returns empty string if no module with two underscores', () => {
    expect(
      createPlannedModularString(['module_foo', 'invalid module', 'module_with_too_many_underscores'])
    ).toStrictEqual('')
  })

  test.each([
    ['P3: A2.', 'module_p3_A2'],
    ['P2: C1.', 'module_p2_C1'],
  ])('returns "%s" for module "module_p3_A2"', (expected, moduleString) => {
    expect(createPlannedModularString([moduleString])).toStrictEqual(expected)
  })

  test.each([
    ['P3: A2, A3.', ['module_p3_A2', 'module_p3_A3']],
    ['P2: C1, C2.', ['module_p2_C1', 'module_p2_C2']],
  ])('combines several schemas for the same period', (expected, modules) => {
    expect(createPlannedModularString(modules)).toStrictEqual(expected)
  })

  test.each([
    ['P3: A2, A3. P2: A1.', ['module_p3_A2', 'module_p2_A1', 'module_p3_A3']],
    ['P2: C1, C2. P1: C3.', ['module_p2_C1', 'module_p1_C3', 'module_p2_C2']],
  ])('combines several schemas for different periods', (expected, modules) => {
    expect(createPlannedModularString(modules)).toStrictEqual(expected)
  })
})
