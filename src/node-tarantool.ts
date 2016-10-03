import { Socket, createConnection } from "net";

import { parseGreeting } from "./protocol";

export type ConnectionOptions = {
    port: number;
}

export class Connection {
    // private salt: string = "";

    protected socket: Socket;

    constructor({ port }: ConnectionOptions) {
        this.socket = createConnection(port);
        this.socket.on("connect", this.onConnect);
        this.socket.on("data", this.onData);
    }

    // auth(user: string, password: string, cb?: () => void): this {
    //     return this;
    // }

    protected onConnect = () => {
        console.log("connected");
    }

    protected onData = (data: Buffer) => {
        console.log(data.byteLength);
        console.log(parseGreeting(data));
    }
}
