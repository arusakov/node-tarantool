import { deepStrictEqual } from 'assert'

import { connect, TarantoolConnection } from '../src'

describe('function calls', () => {

  let tnt: TarantoolConnection

  before(() => connect().then((conn) => {
    tnt = conn
  }))

  after((cb) => {
    tnt.close(cb)
  })

  it('func_nil', async () => {
    deepStrictEqual(await tnt.call('func_nil', []), [null])
  })

  it('func_count', async () => {
    deepStrictEqual(await tnt.call('func_count', []), [0])
  })

  it('func_select', async () => {
    deepStrictEqual(await tnt.call('func_select', []), [[]])
  })
})
