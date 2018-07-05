import { TarantoolClient } from '../src'

describe('TarantoolClient', () => {

  it('first', () => {
    TarantoolClient.connect('tarantool://localhost:3301')
  })
})
