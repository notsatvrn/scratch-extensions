let wss = null;
let connected = false;
let message = "";

class Arachnid {
    constructor(runtime) {
        this.runtime = runtime;
    }

    static get STATE_KEY() {
        return "Scratch.websockets";
    }

    getInfo() {
        return {
            id: "Arachnid",
            name: "Arachnid",
            blocks: [
                {
                    opcode: "connectToServer",
                    blockType: Scratch.BlockType.COMMAND,
                    text: "Connect To Server [url]",
                    arguments: {
                        url: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: "ws://127.0.0.1:3000",
                        },
                    },
                }, {
                    opcode: "sendMessage",
                    blockType: Scratch.BlockType.COMMAND,
                    text: "Send Message [msg]",
                    arguments: {
                        msg: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: "apple",
                        },
                    },
                }, {
                    opcode: "disconnectFromServer",
                    blockType: Scratch.BlockType.COMMAND,
                    text: "Disconnect From Server",
                }, {
                    opcode: "connectedToServer",
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: "Connected To Server?",
                }, {
                    opcode: "getDataFromURL",
                    blockType: Scratch.BlockType.REPORTER,
                    text: "Data From URL [url]",
                    arguments: {
                        url: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: "",
                        },
                    },
                }, {
                    opcode: "getCurrentMessage",
                    blockType: Scratch.BlockType.REPORTER,
                    text: "Current Message",
                }
            ],
        }
    }
    
    // Connected To Server (boolean)
    connectedToServer() {
        return connected;
    }

    // Connect To Server (command)
    connectToServer({url}) {
        wss = new WebSocket(url);

        wss.onopen = () => {
            connected = true;
        }

        wss.onmessage = (event) => {
            message = String(event.data);
        }
    }

    // Data From URL (reporter)
    getDataFromURL({url}) {
        return fetch(url).then(response => response.text());
    }

    // Current Message (reporter)
    getCurrentMessage() {
        return message;
    }

    // Send Message (command)
    sendMessage({msg}) {
        if (connected) {
            wss.send(String(msg));
        }
    }

    // Disconnect From Server (command)
    disconnectFromServer() {
        if (connected) {
            wss.close(1000);
            connected = false;
            message = "";
            wss = null;
        };
    }
}

// Register the extension.
Scratch.extensions.register(new Arachnid());
