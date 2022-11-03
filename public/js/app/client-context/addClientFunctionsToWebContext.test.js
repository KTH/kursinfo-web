import { addClientFunctionsToWebContext } from './addClientFunctionsToWebContext'

describe('Client functions for webContext addClientFunctionsToWebContext', () => {
  test('create a new RouterStore', () => {
    const clientSideContext = addClientFunctionsToWebContext()
    expect(clientSideContext).toMatchInlineSnapshot(`
      {
        "getCourseEmployees": [Function],
      }
    `)
  })
})
