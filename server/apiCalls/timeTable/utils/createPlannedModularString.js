const getCorrectlyFormattedModules = modules =>
  modules.filter(moduleString => {
    const numberOfUnderscores = (moduleString.match(/_/g) || []).length

    return numberOfUnderscores === 2
  })

const extractPeriodAndSchema = moduleString => {
  const [, period, schema] = moduleString.split('_')

  return {
    period: period.toUpperCase(),
    schema,
  }
}

const addKeyIfNonexistent = (obj, key) => {
  if (!Object.prototype.hasOwnProperty.call(obj, key)) {
    obj[key] = []
  }
}

const sortModulesByDigitAndLetter = (a, b) => {
  const [letterA, digitA] = a
  const [letterB, digitB] = b

  return Number(digitA) - Number(digitB) || letterA.localeCompare(letterB)
}

const createPeriodSchemaMapping = modules => {
  const mapping = {}
  modules.forEach(moduleString => {
    const { period, schema } = extractPeriodAndSchema(moduleString)

    addKeyIfNonexistent(mapping, period)

    mapping[period].push(schema)
  })
  return mapping
}

const createPeriodSchemaStrings = modules => {
  const mapping = createPeriodSchemaMapping(modules)

  return Object.keys(mapping).map(period => {
    const sortedModules = mapping[period].sort(sortModulesByDigitAndLetter)

    const schemaString = sortedModules.join(', ')

    return `${period}: ${schemaString}.`
  })
}

const createPlannedModularStringFromArray = modules => {
  const periodSchemaStrings = createPeriodSchemaStrings(modules)

  return periodSchemaStrings.join(' ')
}

const createPlannedModularString = modules => {
  const correctlyFormattedModules = getCorrectlyFormattedModules(modules)
  if (correctlyFormattedModules.length === 0) {
    return ''
  }

  return createPlannedModularStringFromArray(correctlyFormattedModules)
}

module.exports = {
  createPlannedModularString,
}
