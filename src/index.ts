import { createDecodeStream, encode } from 'msgpack-lite'
import { Socket } from 'net'

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
  buf.writeUInt32BE(headerSize + bodySize, 1)
  return buf
}

export const enum TarantoolErrorCode {
  TODO = 1,
}

export class TarantoolError extends Error {

  constructor(
    message: string,
    readonly code: TarantoolErrorCode,
  ) {
    super(message)
  }
}

export type Request = {
  resolve: (data: any) => void
  reject: (err: TarantoolError) => void
  timer: number
}

// tslint:disable-next-line:no-empty
const noop = () => { }
const requestDef: Request = {
  reject: noop,
  resolve: noop,
  timer: 0,
}

const MAX_REQ_ID = 0x0fffffff

type TarantoolPackageSize = number
type TarantoolPackageHeader = {
  [UserKeys.code]: number
  [UserKeys.sync]: number
  [UserKeys.schema_id]: number
}
type TarantoolPackageBody = {
  [UserKeys.data]: any
}

type MsgPackEntity = TarantoolPackageSize | TarantoolPackageHeader | TarantoolPackageBody
const enum MsgPackState {
  wait_size = 0,
  wait_header = 1,
  wait_body = 2,
  __size = 3,
}

const throwError = () => {
  throw new TarantoolError('', TarantoolErrorCode.TODO)
}

const MP_EMPTY_ARR = Buffer.from([0x90])

export class TarantoolConnection {
  private closeCallback: (() => void) | null = null
  private connectCallback: ((tnt: this) => void) = noop
  private ready = false
  private reconnectTimer: NodeJS.Timer | null = null
  private reqId = 0
  private sync = 0
  private socket: Socket | null = null
  private requestMap = new Map<number, Request>()
  private msgPackState = MsgPackState.wait_size

  constructor(
    private readonly hostname = '127.0.0.1',
    private readonly port = 3301,
    private readonly reconnectTimeout = 1000,
  ) {
  }

  public connect(callback: () => void) {
    if (this.ready) {
      throwError()
    }

    this.connectCallback = callback

    this.tryConnect()
  }

  public close(callback: () => void) {
    if (this.socket) {
      this.socket.end()
    }
    this.closeCallback = callback
  }

  public insert(space: number, tuple: any[]) {
    const tupleBuffer = encode(tuple)

    const bodyBuffer = Buffer.allocUnsafe(6 + tupleBuffer.length)
    bodyBuffer[0] = 0x82
    bodyBuffer[1] = UserKeys.space_id
    bodyBuffer[2] = 0xcd
    bodyBuffer.writeInt16BE(space, 3) // 2 bytes
    bodyBuffer[5] = UserKeys.tuple

    tupleBuffer.copy(bodyBuffer, 6)

    return this.request(UserCommandsCodes.insert, bodyBuffer)
  }

  public call(func: string, tuple?: any[]) {
    const tupleBuffer = tuple && tuple.length > 0 ? encode(tuple) : MP_EMPTY_ARR
    const funcBuffer = encode(func)

    const bodyBuffer = Buffer.allocUnsafe(3 + tupleBuffer.length + funcBuffer.length)
    bodyBuffer[0] = 0x82
    bodyBuffer[1] = UserKeys.function_name
    funcBuffer.copy(bodyBuffer, 2)
    bodyBuffer[2 + funcBuffer.length + 1] = UserKeys.tuple
    tupleBuffer.copy(bodyBuffer, 2 + funcBuffer.length + 2)

    return this.request(UserCommandsCodes.call, bodyBuffer)
  }

  private request(code: UserCommandsCodes, body: Buffer) {
    if (!this.ready) {
      throwError()
    }
    const reqId = this.nextReqId()
    const header = new Uint8Array([
      0x82,
      UserKeys.code, code,
      UserKeys.sync, reqId,
    ])
    const prefix = getRequestPrefix(header.length, body.length)

    return new Promise((resolve, reject) => {
      const request = { resolve, reject, timer: 0 }
      this.requestMap.set(reqId, request)
      this.socket!.write(Buffer.concat([prefix, header, body]))
    })
  }

  private ping() {
    return this.request(AdminCommandsCodes.ping as number, new Buffer([]))
  }

  private tryConnect = () => {
    console.log('tryConnect', this.socket && this.socket.destroyed)

    this.reconnectTimer = null
    this.ready = false

    this.socket = new Socket()
    this.socket.setNoDelay(true)
    this.socket.setTimeout(5000)

    this.socket.on('end', this.onEnd)
    this.socket.on('error', this.onError)
    this.socket.on('timeout', this.onTimeout)
    this.socket.once('data', this.onGreeting)

    this.socket.connect(this.port, this.hostname)
  }

  private nextReqId() {
    if (this.reqId > MAX_REQ_ID) {
      this.reqId = 0
    }
    return ++this.reqId
  }

  private onGreeting = (greeting: Buffer) => {
    console.log(greeting)

    this.socket!
      .pipe(createDecodeStream())
      .on('data', this.onMsgPack)

    this.ready = true // ready after auth
    this.connectCallback(this)
  }

  private onMsgPack = (data: MsgPackEntity) => {
    console.log('onData', data)

    switch (this.msgPackState) {
      case MsgPackState.wait_header:
        // todo handle errors
        this.sync = (data as TarantoolPackageHeader)[UserKeys.sync]
        break
      case MsgPackState.wait_body:
        const info = this.requestMap.get(this.sync) || requestDef
        this.requestMap.delete(this.sync)
        info.resolve((data as TarantoolPackageBody)[UserKeys.data])
        break
    }
    if (this.msgPackState === MsgPackState.wait_header) {
      this.sync = (data as TarantoolPackageHeader)[UserKeys.sync]
    }
    this.msgPackState = (this.msgPackState + 1) % MsgPackState.__size
  }

  private onTimeout = () => {
    console.log('onTimeout')
    this.ping()
  }

  private onError = (err: Error) => {
    console.log(`onError: ${err}`, `destroyed ${this.socket!.destroyed}`)
    // todo reject all promises
    this.reconnect()
  }

  private onEnd = (_hadError: boolean) => {
    console.log('onEnd', `destroyed ${this.socket!.destroyed}`)
    if (this.closeCallback) {
      this.closeCallback()
    } else {
      this.reconnect()
    }
  }

  private reconnect() {
    if (!this.reconnectTimer) {
      this.ready = false
      this.socket!.removeAllListeners()
      this.socket!.destroy()
      // this.socket.unpipe(this.decoder)
      this.reconnectTimer = setTimeout(this.tryConnect, this.reconnectTimeout)
    }
  }
}

export const connect = () => {
  return new Promise<TarantoolConnection>((resolve, _reject) => {
    const connection = new TarantoolConnection()
    connection.connect(() => resolve(connection))
  })
}
