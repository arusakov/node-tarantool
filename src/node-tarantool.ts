import { Socket } from 'net'

import { parseGreeting } from './protocol'

export type ConnectionOptions = {
    port: number;
}

export class Connection {
    private socket: Socket
    private port: number

    constructor({ port }: ConnectionOptions) {
        this.port = port
        this.socket = new Socket()

        this.socket.on('connect', this.onConnect)
        this.socket.once('data', this.onGreeting)
    }

    connect(): this {
        this.socket.connect(this.port)
        return this
    }

    send(smth: any): void {
        this.socket.write(smth)
    }

    // todo
    // auth(user: string, password: string, cb?: () => void): this {
    //     return this;
    // }

    protected onConnect = () => {
        console.log('connected')
    }

    protected onGreeting = (data: Buffer) => {
        console.log('Greeting', data.length, data)
        console.log(parseGreeting(data))

        this.socket.on('data', this.onData)
    }

    protected onData = (data: Buffer) => {
        if (data.length < 5) {
            // don't know
            return
        }
        // console.log(decode(data));
        // console.log(decode(data.slice(5)));
    }
}
