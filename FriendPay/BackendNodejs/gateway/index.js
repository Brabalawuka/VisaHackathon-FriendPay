const config = require('../config/config.json');
const { default: axios } = require('axios');

const defaultConfig = config.production;
const port = defaultConfig.node_port;
const dynamicPagePort = defaultConfig.dynamic_page_port;
const baseUrl = defaultConfig.base_url;
const exeternal_baseurl = defaultConfig.exeternal_base_url;
const databaseUrl = `${baseUrl}:${port}/database`;
const notificationUrl = `${baseUrl}:${port}/notification`;

//TODO: Check implementation of this part
const frontendUrl = `${exeternal_baseurl}:${dynamicPagePort}/`;

export async function submitTransaction(req, res){

    const transactionData = {
        //payment information
        currencyCode: req.body.currencyCode,
        amount: req.body.amount,

        //keys
        checkoutKey: req.body.checkoutKey,
        encryptionKey: req.body.encryptionKey,

        //friendpay information
        customerName: req.body.customerName,
        customerEmail: req.body.customerEmail,
        customerMessage: req.body.customerMessage,
        friendName: req.body.friendName,
        friendEmail: req.body.friendEmail,
        friendPhone: req.body.friendPhone,
    };
    // console.log(transactionData);

    try {
        const transaction = await insertTransaction(transactionData);

        try {
            const link = `${frontendUrl}payment?id=${transaction.data._id}`;
            // console.log(link);
            const notificationResponse = await sendNotification(transactionData, link);
            res.status(200);
            res.send(transaction.data._id);
            
        } catch (error) {
            res.send("Could not send notification.");
        }

    } catch (error) {
        res.send("Could not insert transaction.");
    }


}

async function sendNotification(transaction, link){

    var response;
    //send email to friend if email provided.
    // console.log(transaction);
    if(transaction.friendEmail){
        try {
            response = await axios.post(`${notificationUrl}/send-request-email`, {
                to: transaction.friendEmail,
                friend_name:transaction.friendName,
                payee_name: transaction.customerName,
                private_message: transaction.customerMessage,
                payment_link: link
            })
        } catch (error) {
            console.log(error);
            return error.response.data;
        }
    }

    //send sms to friend if phone number provided.
    if(transaction.friendPhone){
        try {
            response = await axios.post(`${notificationUrl}/send-request-sms`, {
                to: transaction.friendPhone,
                friend_name:transaction.friendName,
                payee_name: transaction.customerName,
                private_message: transaction.customerMessage,
                payment_link: link
            });
        } catch (error) {
            console.log(error);
            return error.response.data;
        }
    }

    return response;
}

async function sendConfirmNotification(transaction){

    var response;

    //send confirmation email
    try {
        response = await axios.post(`${notificationUrl}/send-confirm-email`, {
            to:transaction.customerEmail
        })
        return response;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
}

async function sendFailNotification(transaction){

    var response;

    //send fail email
    try {
        response = await axios.post(`${notificationUrl}/send-fail-email`, {
            to:transaction.customerEmail
        })
        return response;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
}

async function insertTransaction(data){

    const transactionData = {
        //payment information
        currencyCode: data.currencyCode,
        amount: data.amount,

        //keys
        checkoutKey: data.checkoutKey,
        encryptionKey: data.encryptionKey,

        //friendpay information
        customerEmail: data.customerEmail,
        customerMessage: data.customerMessage,
        friendEmail: data.friendEmail,
        friendPhone: data.friendPhone,
    };

    try {
        const databaseResponse = await axios.post(`${databaseUrl}/transaction`, transactionData);
        return databaseResponse;
    } catch (error) {
        console.log(error);
    }
}

export async function updateTransaction(req, res){
    const transactionData = {
        transactionId: req.body.transactionId,
        transactionStatus: req.body.transactionStatus,
        visaCallId: req.body.visaCallId,
    };

    try {
        const databaseResponse = await axios.patch(`${databaseUrl}/transaction`, transactionData);

        try{
            if(databaseResponse.data.transactionStatus && databaseResponse.data.transactionStatus == "Success"){
                const notificationResponse = await sendConfirmNotification(databaseResponse.data);
            } else if (databaseResponse.data.transactionStatus && databaseResponse.data.transactionStatus == "Rejected"){
                const notificationResponse = await sendFailNotification(databaseResponse.data);
            }

        }catch  (error){
            console.log(error)
            res.status(200);
            res.send("Could Not send notification")
            return;

        }

        res.status(200);
        res.send(databaseResponse.data);
        
    } catch (error) {
        res.status(404);
        res.send(error.response.data);
    }
}

export async function queryTransaction(req, res){
    const transactionData = {
        transactionId: req.query.transactionId,
    };
    // console.log(transactionData)

    try {
        const databaseResponse = await axios.get(`${databaseUrl}/transaction`, {data: transactionData});
        res.status(200);
        res.send(databaseResponse.data);
    } catch (error) {
        res.status(404);
        res.send(error.response.data);
    }
}

// {
//   status: 200,
//   statusText: 'OK',
//   headers: {
//     'x-powered-by': 'Express',
//     'access-control-allow-origin': '*',
//     'content-type': 'application/json; charset=utf-8',
//     'content-length': '355',
//     etag: 'W/"163-kgQ9RdKKUYNzhdVIE7QSi01XnGY"',
//     date: 'Tue, 30 Jun 2020 14:21:38 GMT',
//     connection: 'close'
//   },
//   config: {
//     url: 'http://localhost:2333/database/transaction',
//     method: 'patch',
//     data: '{"transactionId":"5efb4a5106a25581b36d4eeb","transactionStatus":"Rejected","visaCallId":null}',
//     headers: {
//       Accept: 'application/json, text/plain, */*',
//       'Content-Type': 'application/json;charset=utf-8',
//       'User-Agent': 'axios/0.19.2',
//       'Content-Length': 93
//     },
//     transformRequest: [ [Function: transformRequest] ],
//     transformResponse: [ [Function: transformResponse] ],
//     timeout: 0,
//     adapter: [Function: httpAdapter],
//     xsrfCookieName: 'XSRF-TOKEN',
//     xsrfHeaderName: 'X-XSRF-TOKEN',
//     maxContentLength: -1,
//     validateStatus: [Function: validateStatus]
//   },
//   request: ClientRequest {
//     _events: [Object: null prototype] {
//       socket: [Function],
//       abort: [Function],
//       aborted: [Function],
//       error: [Function],
//       timeout: [Function],
//       prefinish: [Function: requestOnPrefinish]
//     },
//     _eventsCount: 6,
//     _maxListeners: undefined,
//     outputData: [],
//     outputSize: 0,
//     writable: true,
//     _last: true,
//     chunkedEncoding: false,
//     shouldKeepAlive: false,
//     useChunkedEncodingByDefault: true,
//     sendDate: false,
//     _removedConnection: false,
//     _removedContLen: false,
//     _removedTE: false,
//     _contentLength: null,
//     _hasBody: true,
//     _trailer: '',
//     finished: true,
//     _headerSent: true,
//     socket: Socket {
//       connecting: false,
//       _hadError: false,
//       _parent: null,
//       _host: 'localhost',
//       _readableState: [ReadableState],
//       readable: true,
//       _events: [Object: null prototype],
//       _eventsCount: 7,
//       _maxListeners: undefined,
//       _writableState: [WritableState],
//       writable: false,
//       allowHalfOpen: false,
//       _sockname: null,
//       _pendingData: null,
//       _pendingEncoding: '',
//       server: null,
//       _server: null,
//       parser: null,
//       _httpMessage: [Circular],
//       [Symbol(asyncId)]: 451,
//       [Symbol(kHandle)]: [TCP],
//       [Symbol(kSetNoDelay)]: false,
//       [Symbol(lastWriteQueueSize)]: 0,
//       [Symbol(timeout)]: null,
//       [Symbol(kBuffer)]: null,
//       [Symbol(kBufferCb)]: null,
//       [Symbol(kBufferGen)]: null,
//       [Symbol(kCapture)]: false,
//       [Symbol(kBytesRead)]: 0,
//       [Symbol(kBytesWritten)]: 0
//     },
//     connection: Socket {
//       connecting: false,
//       _hadError: false,
//       _parent: null,
//       _host: 'localhost',
//       _readableState: [ReadableState],
//       readable: true,
//       _events: [Object: null prototype],
//       _eventsCount: 7,
//       _maxListeners: undefined,
//       _writableState: [WritableState],
//       writable: false,
//       allowHalfOpen: false,
//       _sockname: null,
//       _pendingData: null,
//       _pendingEncoding: '',
//       server: null,
//       _server: null,
//       parser: null,
//       _httpMessage: [Circular],
//       [Symbol(asyncId)]: 451,
//       [Symbol(kHandle)]: [TCP],
//       [Symbol(kSetNoDelay)]: false,
//       [Symbol(lastWriteQueueSize)]: 0,
//       [Symbol(timeout)]: null,
//       [Symbol(kBuffer)]: null,
//       [Symbol(kBufferCb)]: null,
//       [Symbol(kBufferGen)]: null,
//       [Symbol(kCapture)]: false,
//       [Symbol(kBytesRead)]: 0,
//       [Symbol(kBytesWritten)]: 0
//     },
//     _header: 'PATCH /database/transaction HTTP/1.1\r\n' +
//       'Accept: application/json, text/plain, */*\r\n' +
//       'Content-Type: application/json;charset=utf-8\r\n' +
//       'User-Agent: axios/0.19.2\r\n' +
//       'Content-Length: 93\r\n' +
//       'Host: localhost:2333\r\n' +
//       'Connection: close\r\n' +
//       '\r\n',
//     _onPendingData: [Function: noopPendingOutput],
//     agent: Agent {
//       _events: [Object: null prototype],
//       _eventsCount: 2,
//       _maxListeners: undefined,
//       defaultPort: 80,
//       protocol: 'http:',
//       options: [Object],

// requests: {},
//       sockets: [Object],
//       freeSockets: {},
//       keepAliveMsecs: 1000,
//       keepAlive: false,
//       maxSockets: Infinity,
//       maxFreeSockets: 256,
//       [Symbol(kCapture)]: false
//     },
//     socketPath: undefined,
//     method: 'PATCH',
//     insecureHTTPParser: undefined,
//     path: '/database/transaction',
//     _ended: true,
//     res: IncomingMessage {
//       _readableState: [ReadableState],
//       readable: false,
//       _events: [Object: null prototype],
//       _eventsCount: 3,
//       _maxListeners: undefined,
//       socket: [Socket],
//       connection: [Socket],
//       httpVersionMajor: 1,
//       httpVersionMinor: 1,
//       httpVersion: '1.1',
//       complete: true,
//       headers: [Object],
//       rawHeaders: [Array],
//       trailers: {},
//       rawTrailers: [],
//       aborted: false,
//       upgrade: false,
//       url: '',
//       method: null,
//       statusCode: 200,
//       statusMessage: 'OK',
//       client: [Socket],
//       _consuming: false,
//       _dumped: false,
//       req: [Circular],
//       responseUrl: 'http://localhost:2333/database/transaction',
//       redirects: [],
//       [Symbol(kCapture)]: false
//     },
//     aborted: false,
//     timeoutCb: null,
//     upgradeOrConnect: false,
//     parser: null,
//     maxHeadersCount: null,
//     reusedSocket: false,
//     _redirectable: Writable {
//       _writableState: [WritableState],
//       writable: true,
//       _events: [Object: null prototype],
//       _eventsCount: 2,
//       _maxListeners: undefined,
//       _options: [Object],
//       _redirectCount: 0,
//       _redirects: [],
//       _requestBodyLength: 93,
//       _requestBodyBuffers: [],
//       _onNativeResponse: [Function],
//       _currentRequest: [Circular],
//       _currentUrl: 'http://localhost:2333/database/transaction',
//       [Symbol(kCapture)]: false
//     },
//     [Symbol(kCapture)]: false,
//     [Symbol(kNeedDrain)]: false,
//     [Symbol(corked)]: 0,
//     [Symbol(kOutHeaders)]: [Object: null prototype] {
//       accept: [Array],
//       'content-type': [Array],
//       'user-agent': [Array],
//       'content-length': [Array],
//       host: [Array]
//     }
//   },
//   data: {
//     transactionStatus: 'Rejected',
//     visaCallId: 'null',
//     _id: '5efb4a5106a25581b36d4eeb',
//     currencyCode: 'SGD',
//     amount: '10',
//     checkoutKey: 'tobeconfirmed',
//     encryptionKey: 'tobeconfirmed',
//     customerEmail: 'wangshining814@gmail.com',
//     customerMessage: '',
//     friendEmail: 'wangshining814@gmail.com',
//     friendPhone: null,
//     timeCreated: '2020-06-30T14:21:05.257Z',
//     __v: 0
//   }
// }
