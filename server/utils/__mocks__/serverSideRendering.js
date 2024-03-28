const getServerSideFunctions = () => ({
  getCompressedData: () => console.log('foo'),
  renderStaticPage: jest.fn(),
})

module.exports = { getServerSideFunctions }
