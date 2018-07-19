import { deepStrictEqual } from 'assert'

import { exec } from 'shelljs' // tslint:disable-line

import { connect, TarantoolConnection } from '../src'

describe('tarantool restart', () => {
  let tnt: TarantoolConnection

  before(() => connect().then((conn) => {
    tnt = conn
  }))

  after((cb) => {
    tnt.close(cb)
  })

  it('restart', async () => {
    deepStrictEqual(await tnt.call('func_nil', []), [null])
    exec('docker restart tarantool')
    deepStrictEqual(await tnt.call('func_nil', []), [null])
  })
})

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
