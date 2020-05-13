const net = require('net');

class Request {
    constructor(options){
        
        this.method = options.method || "GET";
        this.host = options.host;
        this.port = options.port || 80;
        this.path = options.path || '/';
        this.body = options.body || {};
        this.headers = options.headers || {};
        if (!this.headers["Content-Type"]) {
            this.headers["Content-Type"] = "application/x-www-form-urlencoded";
        }
        if (this.headers["Content-Type"] === "application/json") {
            this.bodyText = JSON.stringify(this.body);
        } else if (this.headers["Content-Type"] === "application/x-www-form-urlencoded") {
            this.bodyText = Object.keys(this.body).map(key => {
                return `${key}=${encodeURIComponent(this.body[key])}`
            }).join("&");
        }
        this.headers["Content-Length"] = this.bodyText.length;
    }
    toString(){
        return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join("\r\n")}
\r
${this.bodyText}`
    }
    send(connection){
        return new Promise((resolve, reject) => {
            const parser = new ResponseParser()
            if (connection) {
                connection.write(this.toString());
            } else {
                connection = net.createConnection({
                    host: this.host,
                    port: this.port
                }, () => {
                    connection.write(this.toString())
                })
            }
            /**
             * data事件是不确定触发多少次的：
             * 1.服务端可能发了不止一个包
             * 2.客户端可能buffer写满了，buffer有可能比包大，也有可能比包小
             * data是一个node的 buffer
             */
            connection.on('data', (data) => {
                // 把数据喂给ResponseParser
                parser.receive(data.toString());
                // console.log(parser.statusLine);
                // console.log(parser.headers);
                // resolve(data.toString());
                if (parser.isFinished) {
                    resolve(parser.response);
                }
                connection.end();
            });
            connection.on('error', (err) => {
                reject(err);
                connection.end();
            })
        })
        
    }
}

class Response {

}

class ResponseParser {
    constructor () {
        this.WAITING_STATUS_LINE = 0;
        this.WAITING_STATUS_LINE_END = 1; // 接收到status line的\r\n
        this.WAITING_HEADER_NAME = 2;
        this.WAITING_HEADER_SPACE = 3;
        this.WAITING_HEADER_VALUE = 4;
        this.WAITING_HEADER_LINE_END = 5;
        this.WAITING_HEADER_BLOCK_END = 6;
        this.WAITING_BODY = 7;
        this.currentStatus = this.WAITING_STATUS_LINE;
        this.statusLine = '';
        this.headers = {};
        this.headerName = '';
        this.headerValue = '';
        this.bodyParser = null;
    }
    get isFinished() {
        return this.bodyParser && this.bodyParser.isFinished;
    }
    get response() {
        this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\S\s]+)/);
        return {
            statusCode: RegExp.$1,
            statusText: RegExp.$2,
            headers: this.headers,
            body: this.bodyParser.content.join('')
        }
    }
    // 接受一串字符
    receive (string ){
        for (let i = 0; i < string.length; i++) {
            this.receiveChar(string.charAt(i));
        }
    }
    // 接受一个字符
    receiveChar (char) {
        if (this.currentStatus === this.WAITING_STATUS_LINE) {
            if (char === '\r') {
                this.currentStatus = this.WAITING_STATUS_LINE_END
            } else if (char === '\n') {
                this.currentStatus = this.WAITING_HEADER_NAME
            } else {
                this.statusLine += char;
            }
            
        } else if (this.currentStatus === this.WAITING_STATUS_LINE_END) {
            if (char === '\n') {
                this.currentStatus = this.WAITING_HEADER_NAME
            }
        } else if (this.currentStatus === this.WAITING_HEADER_NAME) {
            
            if (char === ':') {
                this.currentStatus = this.WAITING_HEADER_SPACE;
            } else if (char === '\r') {
                this.currentStatus = this.WAITING_HEADER_BLOCK_END;
                if (this.headers['Transfer-Encoding'] === 'chunked') {
                    this.bodyParser = new TrunkedBodyParser();
                }
                
            } else {
                this.headerName += char;
            }
        } else if (this.currentStatus === this.WAITING_HEADER_SPACE) {
            if (char === ' ') {
                this.currentStatus = this.WAITING_HEADER_VALUE;
            }
        } else if (this.currentStatus === this.WAITING_HEADER_VALUE) {
            if (char === '\r') {
                this.currentStatus = this.WAITING_HEADER_LINE_END;
                this.headers[this.headerName] = this.headerValue;
                this.headerName = '';
                this.headerValue = '';
            } else {
                this.headerValue += char;
            }
        } else if (this.currentStatus === this.WAITING_HEADER_LINE_END) {
            if (char === '\n') {
                this.currentStatus = this.WAITING_HEADER_NAME;
            }
        } else if (this.currentStatus === this.WAITING_HEADER_BLOCK_END) {
            if (char === '\n') {
                this.currentStatus = this.WAITING_BODY;
            }
        } else if (this.currentStatus === this.WAITING_BODY) {
            this.bodyParser.receiveChar(char);
        }
    }
}

class TrunkedBodyParser {
    constructor(){
        this.WAITING_LENGTH = 0;
        this.WAITING_LENGTH_LINE_END = 1;
        this.READING_TRUNK = 2;
        this.WAITING_NEW_LINE = 3;
        this.WAITING_NEW_LINE_END = 4;
        this.isFinished = false;
        this.length = 0;
        this.content = [];
        this.currentStatus = this.WAITING_LENGTH;
    }
    receiveChar(char) {
        if (this.currentStatus === this.WAITING_LENGTH) {
            if (char === '\r') {
                if (this.length === 0) {
                    this.isFinished = true;
                    this.currentStatus = this.isFinished;
                } else {
                    this.currentStatus = this.WAITING_LENGTH_LINE_END;
                }
                
            } else {
                this.length *= 10;
                this.length += char.charCodeAt(0) - '0'.charCodeAt(0);
            }
        } else if (this.currentStatus === this.WAITING_LENGTH_LINE_END) {
            if (char === '\n') {
                this.currentStatus = this.READING_TRUNK;
            }
        } else if (this.currentStatus === this.READING_TRUNK) {
            this.content.push(char);
            this.length--;
            if (this.length === 0) {
                this.currentStatus = this.WAITING_NEW_LINE;
            }
        } else if (this.currentStatus === this.WAITING_NEW_LINE) {
            if (char === '\r') {
                this.currentStatus = this.WAITING_NEW_LINE_END;
            }
        } else if (this.currentStatus === this.WAITING_NEW_LINE_END) {
            if (char === '\n') {
                this.currentStatus = this.WAITING_LENGTH;
            }
        }
    }
}


void async function () {
    let request = new Request({
        method: 'POST',
        host: '127.0.0.1',
        port: '8088',
        path: '/',
        headers: {
            ["X-Foo2"]: "customed"
        },
        body: {
            name: 'winter'
        }
    })
    let response = await request.send();
    console.log(response)
}()