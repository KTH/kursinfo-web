const mockGetAsync = jest.fn().mockResolvedValue({
  response: {
    statusCode: 200,
  },
})

module.exports = {
  mockGetAsync,
}
