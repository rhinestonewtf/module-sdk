import { getClient } from '../../../src/common/getClient'
import { MockClient } from '../../utils/mocks/client'

describe('Get a client', () => {
  it('should create a client from the mock client', async () => {
    const client = getClient(MockClient)

    expect(client).toBeDefined()
  })
})
