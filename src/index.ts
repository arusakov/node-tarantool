import { Socket } from 'net'
import { parse } from 'url'

import { decode } from './msgpack/decode'

export type ConnectOptions = {
  noDelay?: boolean
  keepAlive?: boolean
  keepAliveTimeout?: number
}

export const enum UserKeys {
  code = 0x00,
  sync = 0x01,
  schema_id = 0x05,
  space_id = 0x10,
  index_id = 0x11,
  limit = 0x12,
  offset = 0x13,
  iterator = 0x14,
  key = 0x20,
  tuple = 0x21,
  function_name = 0x22,
  username = 0x23,
  expression = 0x27,
  ops = 0x28,
  data = 0x30,
  error = 0x31,
}

export const enum UserCommandsCodes {
  select = 0x01,
  insert = 0x02,
  replace = 0x03,
  update = 0x04,
  delete = 0x05,
  call_16 = 0x06,
  auth = 0x07,
  eval = 0x08,
  upsert = 0x09,
  call = 0x0a,
}

export const enum AdminCommandsCodes {
 ping = 0x40,
 join = 0x41,
 subscribe = 0x42,
 request_vote = 0x43,
}

export const enum ResponseCodeValue {
  OK = 0x00,
  ERROR = 0x8000,
}

const getRequestPrefix = (headerSize: number, bodySize: number) => {
  const buf = Buffer.allocUnsafe(5)
  buf[0] = 0xCE
  buf.writeInt32BE(headerSize + bodySize, 1)
  return buf
}

export class TarantoolClient {
  static connect(url: string) {
    const parsedUrl = parse(url)

    const port = Number(parsedUrl.port || 3301)
    const hostname = parsedUrl.hostname || '127.0.0.1'

    const socket = new Socket()

    socket.setKeepAlive(true, 30000)
    socket.setNoDelay(true)
    socket.setTimeout(30000, () => {
      console.log('socket-timeout')
    })

    socket.on('error', (err) => {
      console.log(`socket-error: ${err}`, err)
    })

    socket.once('data', (greeting) => {
      console.log('tarantool-greeting:', greeting.toString('binary'))

      socket.on('data', (data) => {
        console.log('tarantool-data:', data.toString('hex'))
        console.log('tarantool-data-length:', data.length)

        console.log('tarantool-packet-size:', data.readInt32BE(1))
        console.log('tarantool-header-map:', data, decode(data.slice(5)))
      })

      const pingHeader = new Uint8Array([
        0x82,
        UserKeys.code, AdminCommandsCodes.ping,
        UserKeys.sync, 1,
      ])
      const prefix = getRequestPrefix(pingHeader.length, 0)

      socket.write(Buffer.concat([prefix, pingHeader]))

      setTimeout(() => {
        pingHeader[4] = 2
        socket.write(Buffer.concat([prefix, pingHeader]))

        socket.end()
      }, 1000)
    })

    socket.on('end', () => {
      console.log('socket-end')
    })

    socket.connect(port, hostname)
  }
}
