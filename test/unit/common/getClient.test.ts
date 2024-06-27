import { getClient } from 'src'
import { MockClient } from 'test/utils/mocks/client'

describe('Get a client', () => {
  it('should create a client from the mock client', async () => {
    const client = getClient(MockClient)

    expect(client).toBeDefined()
  })
})
