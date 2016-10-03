import { Socket } from "net";

import { } from "./protocol";

export type ConnectionOptions = {
    port: number;
}

export class Connection {
    private socket: Socket;
    private port: number;

    constructor({ port }: ConnectionOptions) {
        this.port = port;
        this.socket = new Socket({
            readable: true,
            writable: true,
        } as any); // todo @arusakov give back to DT repo

        this.socket.on("connect", this.onConnect);
        this.socket.on("data", this.onData);
    }

    connect(): this {
        this.socket.connect(this.port);
        return this;
    }

    send(smth: any): void {
        this.socket.write(smth);
    }

    // todo 
    // auth(user: string, password: string, cb?: () => void): this {
    //     return this;
    // }

    protected onConnect = () => {
        console.log("connected");
    }

    protected onData = (data: Buffer) => {
        console.log(data.byteLength);
        console.log(data);
        console.log(decode(data.slice(5)));
        // console.log(parseGreeting(data));
    }
}
