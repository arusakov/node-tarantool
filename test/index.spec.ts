import { deepStrictEqual } from 'assert'

import { exec } from 'shelljs' // tslint:disable-line:no-implicit-dependencies

import { connect, TarantoolConnection } from '../src'

const timeoutPromise = (ms: number) => new Promise((resolve) => {
  setTimeout(resolve, ms)
})

const DOCKER_NAME = 'tarantool'

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

describe('tarantool restarting', () => {
  let tnt: TarantoolConnection

  before(() => connect().then((conn) => {
    tnt = conn
  }))

  after((cb) => {
    tnt.close(cb)
  })

  it('restart', async () => {
    deepStrictEqual(await tnt.call('func_nil', []), [null])

    exec(`docker restart ${DOCKER_NAME}`)
    await timeoutPromise(2000)

    deepStrictEqual(await tnt.call('func_nil', []), [null])
  })

  it('kill', async () => {
    deepStrictEqual(await tnt.call('func_nil', []), [null])

    exec(`docker kill ${DOCKER_NAME} && docker start ${DOCKER_NAME}`)
    await timeoutPromise(2000)

    deepStrictEqual(await tnt.call('func_nil', []), [null])
  })
})

describe('tarantool is not started', () => {

  before(() => {
    exec(`docker stop ${DOCKER_NAME}`)
  })

  it('_', async () => {
    let tnt: TarantoolConnection
    return Promise.all([
      connect()
        .then((conn) => {
          tnt = conn
          return tnt.call('func_nil')
        })
        .then((result) => deepStrictEqual(result, [null]))
        .then(() => new Promise((resolve) => {
          tnt.close(resolve)
        })),
      timeoutPromise(1000)
        .then(() => exec(`docker start ${DOCKER_NAME}`)),
    ])
  })
})
