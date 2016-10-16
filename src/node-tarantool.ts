import { Socket } from "net";

import { createDecodeStream } from "msgpack-lite";

import { Protocol } from "./protocol";
import {
    TResponse,
    TResponseHeader,
} from "./tarantool-types";

export type ConnectionOptions = {
    port: number;
}

export class Connection {
    private socket: Socket;
    private port: number;
    private protocol = new Protocol();

    constructor({ port }: ConnectionOptions) {
        this.port = port;
        this.socket = new Socket({
            readable: true,
            writable: true,
        } as any); // todo @arusakov give back to DT repo

        this.socket.on("connect", this.onConnect);
        this.socket.once("data", this.onGreeting);
    }

    connect(): this {
        this.socket.connect(this.port);
        return this;
    }

    send(header: Buffer, body: Buffer): void {
        this.socket.write(Buffer.concat([
            this.protocol.getPrefix(header.length + body.length),
            header,
            body,
        ]));
    }

    // todo 
    // auth(user: string, password: string, cb?: () => void): this {
    //     return this;
    // }

    protected onConnect = () => {
        console.log("connected");
    }

    protected onGreeting = (data: Buffer) => {
        console.log("Greeting", data.length, data);
        console.log(Protocol.parseGreeting(data));

        this.socket.on("data", this.onData);
        // this.socket.pipe(createDecodeStream()).on("data", this.onData);
    }

    protected onData = (data: Buffer) => {
        // if (typeof data === "object") {
            console.log(data.toString('base64'));
        // }
    }
}
