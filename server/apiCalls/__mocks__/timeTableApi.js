const mockData = [
  {
    offerings: [
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
    ],
  },
  {
    offerings: [
      {
        id: 'SH2702-12345 (VT24)',
        course: {
          id: 'SH2702',
          description: 'Reaktorteknologi',
        },
        semester: 'VT24',
        ladokId: '1',
        modules: ['module_p3_A2', 'module_p3_I1', 'module_p3_I2'],
      },
    ],
  },
]

const getOfferingsWithModules = jest.fn()

module.exports = {
  getOfferingsWithModules,
}
