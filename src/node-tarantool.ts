import { Socket } from 'net'

import { parseGreeting, getPrefix } from './protocol'

export type ConnectionOptions = {
    port: number
}

export class Connection {
    private socket: Socket
    private port: number

    constructor({ port }: ConnectionOptions) {
        this.port = port
        this.socket = new Socket()
        this.socket.setNoDelay()

        this.socket.on('connect', this.onConnect)
        this.socket.once('data', this.onGreeting)
    }

    connect() {
        this.socket.connect(this.port)
        return this
    }

    sendRaw(header: Buffer, body: Buffer) {
        this.socket.write(Buffer.concat([
            getPrefix(header.length + body.length),
            header,
            body,
        ], 5/* prefix size */+ header.length + body.length))
    }

    insert(_spaceId: number, _tuple: any[]): Promise<any> {
        return new Promise((resolve, reject) => {
            // this.sendRaw(Buffer.from([]))
        })
    }

    // todo
    // auth(user: string, password: string, cb?: () => void): this {
    //     return this;
    // }

    protected onConnect = () => {
        console.log('connected')
    }

    protected onGreeting = (data: Buffer) => {
        console.log(parseGreeting(data))
        this.socket.on('data', this.onData)
    }

    protected onData = (data: Buffer) => {
        console.log(data)
        if (data.length < 5) {
            // don't know
            return
        }
        console.log(data.toString())
        // console.log(decode(data));
        // console.log(decode(data.slice(5)));
    }
}
