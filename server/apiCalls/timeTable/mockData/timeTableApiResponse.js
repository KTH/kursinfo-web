const offeringWithoutModules = {
  id: 'SH2702-1 (VT24)',
  course: {
    id: 'SH2702',
    description: 'Reaktorteknologi',
  },
  semester: 'VT24',
  ladokId: '1',
}

const validOffering1 = {
  id: 'SH2702-1 (VT24)',
  course: {
    id: 'SH2702',
    description: 'Reaktorteknologi',
  },
  semester: 'VT24',
  ladokId: '1',
  modules: ['module_p3_A2', 'module_p3_I1', 'module_p3_I2'],
}

const validOffering2 = {
  id: 'SH2702-2 (VT24)',
  course: {
    id: 'SH2702',
    description: 'Reaktorteknologi',
  },
  semester: 'VT24',
  ladokId: '1',
  modules: ['module_p3_A2', 'module_p3_I1', 'module_p3_I2'],
}

const offeringsWithMultipleValid = [
  {
    id: 'SH2702-1 (VT24)',
    course: {
      id: 'SH2702',
      description: 'Reaktorteknologi',
    },
    semester: 'VT24',
    ladokId: '1',
    modules: ['module_p3_A2', 'module_p3_I1', 'module_p3_I2'],
  },
  {
    id: 'SH2702-2 (VT24)',
    course: {
      id: 'SH2702',
      description: 'Reaktorteknologi',
    },
    semester: 'VT24',
    ladokId: '2',
    modules: ['module_p3_A2', 'module_p3_I1', 'module_p3_I2'],
  },
]

const reservations = [
  {
    offerings: [offeringWithoutModules],
  },
  {
    offerings: [validOffering1],
  },
  {
    offerings: offeringsWithMultipleValid,
  },
  {
    offerings: [validOffering2],
  },
  {
    offerings: [],
  },
]

module.exports = {
  reservations,
  offeringWithoutModules,
  offeringsWithMultipleValid,
  validOffering1,
  validOffering2,
}
