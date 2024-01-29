import { createClient } from '../../..//src/common/createClient'
import { MockClient } from '../../utils/mocks/client'

describe('Create a client', () => {
  it('should create a client from the mock client', async () => {
    const client = createClient(MockClient)

    expect(client).toBeDefined()
  })
})
