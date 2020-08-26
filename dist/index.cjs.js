'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __values(o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

var Event$1 = /** @class */ (function () {
    function Event(type, target) {
        this.target = target;
        this.type = type;
    }
    return Event;
}());
var ErrorEvent = /** @class */ (function (_super) {
    __extends(ErrorEvent, _super);
    function ErrorEvent(error, target) {
        var _this = _super.call(this, 'error', target) || this;
        _this.message = error.message;
        _this.error = error;
        return _this;
    }
    return ErrorEvent;
}(Event$1));
var CloseEvent = /** @class */ (function (_super) {
    __extends(CloseEvent, _super);
    function CloseEvent(code, reason, target) {
        if (code === void 0) { code = 1000; }
        if (reason === void 0) { reason = ''; }
        var _this = _super.call(this, 'close', target) || this;
        _this.wasClean = true;
        _this.code = code;
        _this.reason = reason;
        return _this;
    }
    return CloseEvent;
}(Event$1));

/*!
 * Reconnecting WebSocket
 * by Pedro Ladaria <pedro.ladaria@gmail.com>
 * https://github.com/pladaria/reconnecting-websocket
 * License MIT
 */
var getGlobalWebSocket = function () {
    if (typeof WebSocket !== 'undefined') {
        // @ts-ignore
        return WebSocket;
    }
};
/**
 * Returns true if given argument looks like a WebSocket class
 */
var isWebSocket = function (w) { return typeof w !== 'undefined' && !!w && w.CLOSING === 2; };
var DEFAULT = {
    maxReconnectionDelay: 10000,
    minReconnectionDelay: 1000 + Math.random() * 4000,
    minUptime: 5000,
    reconnectionDelayGrowFactor: 1.3,
    connectionTimeout: 4000,
    maxRetries: Infinity,
    maxEnqueuedMessages: Infinity,
    startClosed: false,
    debug: false,
};
var ReconnectingWebSocket = /** @class */ (function () {
    function ReconnectingWebSocket(url, protocols, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        this._listeners = {
            error: [],
            message: [],
            open: [],
            close: [],
        };
        this._retryCount = -1;
        this._shouldReconnect = true;
        this._connectLock = false;
        this._binaryType = 'blob';
        this._closeCalled = false;
        this._messageQueue = [];
        /**
         * An event listener to be called when the WebSocket connection's readyState changes to CLOSED
         */
        this.onclose = null;
        /**
         * An event listener to be called when an error occurs
         */
        this.onerror = null;
        /**
         * An event listener to be called when a message is received from the server
         */
        this.onmessage = null;
        /**
         * An event listener to be called when the WebSocket connection's readyState changes to OPEN;
         * this indicates that the connection is ready to send and receive data
         */
        this.onopen = null;
        this._handleOpen = function (event) {
            _this._debug('open event');
            var _a = _this._options.minUptime, minUptime = _a === void 0 ? DEFAULT.minUptime : _a;
            clearTimeout(_this._connectTimeout);
            _this._uptimeTimeout = setTimeout(function () { return _this._acceptOpen(); }, minUptime);
            _this._ws.binaryType = _this._binaryType;
            // send enqueued messages (messages sent before websocket open event)
            _this._messageQueue.forEach(function (message) { return _this._ws.send(message); });
            _this._messageQueue = [];
            if (_this.onopen) {
                _this.onopen(event);
            }
            _this._listeners.open.forEach(function (listener) { return _this._callEventListener(event, listener); });
        };
        this._handleMessage = function (event) {
            _this._debug('message event');
            if (_this.onmessage) {
                _this.onmessage(event);
            }
            _this._listeners.message.forEach(function (listener) { return _this._callEventListener(event, listener); });
        };
        this._handleError = function (event) {
            _this._debug('error event', event.message);
            _this._disconnect(undefined, event.message === 'TIMEOUT' ? 'timeout' : undefined);
            if (_this.onerror) {
                _this.onerror(event);
            }
            _this._debug('exec error listeners');
            _this._listeners.error.forEach(function (listener) { return _this._callEventListener(event, listener); });
            _this._connect();
        };
        this._handleClose = function (event) {
            _this._debug('close event');
            _this._clearTimeouts();
            if (_this._shouldReconnect) {
                _this._connect();
            }
            if (_this.onclose) {
                _this.onclose(event);
            }
            _this._listeners.close.forEach(function (listener) { return _this._callEventListener(event, listener); });
        };
        this._url = url;
        this._protocols = protocols;
        this._options = options;
        if (this._options.startClosed) {
            this._shouldReconnect = false;
        }
        this._connect();
    }
    Object.defineProperty(ReconnectingWebSocket, "CONNECTING", {
        get: function () {
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket, "OPEN", {
        get: function () {
            return 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket, "CLOSING", {
        get: function () {
            return 2;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket, "CLOSED", {
        get: function () {
            return 3;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket.prototype, "CONNECTING", {
        get: function () {
            return ReconnectingWebSocket.CONNECTING;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket.prototype, "OPEN", {
        get: function () {
            return ReconnectingWebSocket.OPEN;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket.prototype, "CLOSING", {
        get: function () {
            return ReconnectingWebSocket.CLOSING;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket.prototype, "CLOSED", {
        get: function () {
            return ReconnectingWebSocket.CLOSED;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket.prototype, "binaryType", {
        get: function () {
            return this._ws ? this._ws.binaryType : this._binaryType;
        },
        set: function (value) {
            this._binaryType = value;
            if (this._ws) {
                this._ws.binaryType = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket.prototype, "retryCount", {
        /**
         * Returns the number or connection retries
         */
        get: function () {
            return Math.max(this._retryCount, 0);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket.prototype, "bufferedAmount", {
        /**
         * The number of bytes of data that have been queued using calls to send() but not yet
         * transmitted to the network. This value resets to zero once all queued data has been sent.
         * This value does not reset to zero when the connection is closed; if you keep calling send(),
         * this will continue to climb. Read only
         */
        get: function () {
            var bytes = this._messageQueue.reduce(function (acc, message) {
                if (typeof message === 'string') {
                    acc += message.length; // not byte size
                }
                else if (message instanceof Blob) {
                    acc += message.size;
                }
                else {
                    acc += message.byteLength;
                }
                return acc;
            }, 0);
            return bytes + (this._ws ? this._ws.bufferedAmount : 0);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket.prototype, "extensions", {
        /**
         * The extensions selected by the server. This is currently only the empty string or a list of
         * extensions as negotiated by the connection
         */
        get: function () {
            return this._ws ? this._ws.extensions : '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket.prototype, "protocol", {
        /**
         * A string indicating the name of the sub-protocol the server selected;
         * this will be one of the strings specified in the protocols parameter when creating the
         * WebSocket object
         */
        get: function () {
            return this._ws ? this._ws.protocol : '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket.prototype, "readyState", {
        /**
         * The current state of the connection; this is one of the Ready state constants
         */
        get: function () {
            if (this._ws) {
                return this._ws.readyState;
            }
            return this._options.startClosed
                ? ReconnectingWebSocket.CLOSED
                : ReconnectingWebSocket.CONNECTING;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket.prototype, "url", {
        /**
         * The URL as resolved by the constructor
         */
        get: function () {
            return this._ws ? this._ws.url : '';
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Closes the WebSocket connection or connection attempt, if any. If the connection is already
     * CLOSED, this method does nothing
     */
    ReconnectingWebSocket.prototype.close = function (code, reason) {
        if (code === void 0) { code = 1000; }
        this._closeCalled = true;
        this._shouldReconnect = false;
        this._clearTimeouts();
        if (!this._ws) {
            this._debug('close enqueued: no ws instance');
            return;
        }
        if (this._ws.readyState === this.CLOSED) {
            this._debug('close: already closed');
            return;
        }
        this._ws.close(code, reason);
    };
    /**
     * Closes the WebSocket connection or connection attempt and connects again.
     * Resets retry counter;
     */
    ReconnectingWebSocket.prototype.reconnect = function (code, reason) {
        this._shouldReconnect = true;
        this._closeCalled = false;
        this._retryCount = -1;
        if (!this._ws || this._ws.readyState === this.CLOSED) {
            this._connect();
        }
        else {
            this._disconnect(code, reason);
            this._connect();
        }
    };
    /**
     * Enqueue specified data to be transmitted to the server over the WebSocket connection
     */
    ReconnectingWebSocket.prototype.send = function (data) {
        if (this._ws && this._ws.readyState === this.OPEN) {
            this._debug('send', data);
            this._ws.send(data);
        }
        else {
            var _a = this._options.maxEnqueuedMessages, maxEnqueuedMessages = _a === void 0 ? DEFAULT.maxEnqueuedMessages : _a;
            if (this._messageQueue.length < maxEnqueuedMessages) {
                this._debug('enqueue', data);
                this._messageQueue.push(data);
            }
        }
    };
    /**
     * Register an event handler of a specific event type
     */
    ReconnectingWebSocket.prototype.addEventListener = function (type, listener) {
        if (this._listeners[type]) {
            // @ts-ignore
            this._listeners[type].push(listener);
        }
    };
    ReconnectingWebSocket.prototype.dispatchEvent = function (event) {
        var e_1, _a;
        var listeners = this._listeners[event.type];
        if (listeners) {
            try {
                for (var listeners_1 = __values(listeners), listeners_1_1 = listeners_1.next(); !listeners_1_1.done; listeners_1_1 = listeners_1.next()) {
                    var listener = listeners_1_1.value;
                    this._callEventListener(event, listener);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (listeners_1_1 && !listeners_1_1.done && (_a = listeners_1.return)) _a.call(listeners_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        return true;
    };
    /**
     * Removes an event listener
     */
    ReconnectingWebSocket.prototype.removeEventListener = function (type, listener) {
        if (this._listeners[type]) {
            // @ts-ignore
            this._listeners[type] = this._listeners[type].filter(function (l) { return l !== listener; });
        }
    };
    ReconnectingWebSocket.prototype._debug = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this._options.debug) {
            // not using spread because compiled version uses Symbols
            // tslint:disable-next-line
            console.log.apply(console, __spread(['RWS>'], args));
        }
    };
    ReconnectingWebSocket.prototype._getNextDelay = function () {
        var _a = this._options, _b = _a.reconnectionDelayGrowFactor, reconnectionDelayGrowFactor = _b === void 0 ? DEFAULT.reconnectionDelayGrowFactor : _b, _c = _a.minReconnectionDelay, minReconnectionDelay = _c === void 0 ? DEFAULT.minReconnectionDelay : _c, _d = _a.maxReconnectionDelay, maxReconnectionDelay = _d === void 0 ? DEFAULT.maxReconnectionDelay : _d;
        var delay = 0;
        if (this._retryCount > 0) {
            delay =
                minReconnectionDelay * Math.pow(reconnectionDelayGrowFactor, this._retryCount - 1);
            if (delay > maxReconnectionDelay) {
                delay = maxReconnectionDelay;
            }
        }
        this._debug('next delay', delay);
        return delay;
    };
    ReconnectingWebSocket.prototype._wait = function () {
        var _this = this;
        return new Promise(function (resolve) {
            setTimeout(resolve, _this._getNextDelay());
        });
    };
    ReconnectingWebSocket.prototype._getNextUrl = function (urlProvider) {
        if (typeof urlProvider === 'string') {
            return Promise.resolve(urlProvider);
        }
        if (typeof urlProvider === 'function') {
            var url = urlProvider();
            if (typeof url === 'string') {
                return Promise.resolve(url);
            }
            if (!!url.then) {
                return url;
            }
        }
        throw Error('Invalid URL');
    };
    ReconnectingWebSocket.prototype._connect = function () {
        var _this = this;
        if (this._connectLock || !this._shouldReconnect) {
            return;
        }
        this._connectLock = true;
        var _a = this._options, _b = _a.maxRetries, maxRetries = _b === void 0 ? DEFAULT.maxRetries : _b, _c = _a.connectionTimeout, connectionTimeout = _c === void 0 ? DEFAULT.connectionTimeout : _c, _d = _a.WebSocket, WebSocket = _d === void 0 ? getGlobalWebSocket() : _d;
        if (this._retryCount >= maxRetries) {
            this._debug('max retries reached', this._retryCount, '>=', maxRetries);
            return;
        }
        this._retryCount++;
        this._debug('connect', this._retryCount);
        this._removeListeners();
        if (!isWebSocket(WebSocket)) {
            throw Error('No valid WebSocket class provided');
        }
        this._wait()
            .then(function () { return _this._getNextUrl(_this._url); })
            .then(function (url) {
            // close could be called before creating the ws
            if (_this._closeCalled) {
                return;
            }
            _this._debug('connect', { url: url, protocols: _this._protocols });
            _this._ws = _this._protocols
                ? new WebSocket(url, _this._protocols)
                : new WebSocket(url);
            _this._ws.binaryType = _this._binaryType;
            _this._connectLock = false;
            _this._addListeners();
            _this._connectTimeout = setTimeout(function () { return _this._handleTimeout(); }, connectionTimeout);
        });
    };
    ReconnectingWebSocket.prototype._handleTimeout = function () {
        this._debug('timeout event');
        this._handleError(new ErrorEvent(Error('TIMEOUT'), this));
    };
    ReconnectingWebSocket.prototype._disconnect = function (code, reason) {
        if (code === void 0) { code = 1000; }
        this._clearTimeouts();
        if (!this._ws) {
            return;
        }
        this._removeListeners();
        try {
            this._ws.close(code, reason);
            this._handleClose(new CloseEvent(code, reason, this));
        }
        catch (error) {
            // ignore
        }
    };
    ReconnectingWebSocket.prototype._acceptOpen = function () {
        this._debug('accept open');
        this._retryCount = 0;
    };
    ReconnectingWebSocket.prototype._callEventListener = function (event, listener) {
        if ('handleEvent' in listener) {
            // @ts-ignore
            listener.handleEvent(event);
        }
        else {
            // @ts-ignore
            listener(event);
        }
    };
    ReconnectingWebSocket.prototype._removeListeners = function () {
        if (!this._ws) {
            return;
        }
        this._debug('removeListeners');
        this._ws.removeEventListener('open', this._handleOpen);
        this._ws.removeEventListener('close', this._handleClose);
        this._ws.removeEventListener('message', this._handleMessage);
        // @ts-ignore
        this._ws.removeEventListener('error', this._handleError);
    };
    ReconnectingWebSocket.prototype._addListeners = function () {
        if (!this._ws) {
            return;
        }
        this._debug('addListeners');
        this._ws.addEventListener('open', this._handleOpen);
        this._ws.addEventListener('close', this._handleClose);
        this._ws.addEventListener('message', this._handleMessage);
        // @ts-ignore
        this._ws.addEventListener('error', this._handleError);
    };
    ReconnectingWebSocket.prototype._clearTimeouts = function () {
        clearTimeout(this._connectTimeout);
        clearTimeout(this._uptimeTimeout);
    };
    return ReconnectingWebSocket;
}());

require("./noConflict");

var _global = _interopRequireDefault(require("core-js/library/fn/global"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

if (_global["default"]._babelPolyfill && typeof console !== "undefined" && console.warn) {
  console.warn("@babel/polyfill is loaded more than once on this page. This is probably not desirable/intended " + "and may have consequences if different versions of the polyfills are applied sequentially. " + "If you do need to load the polyfill more than once, use @babel/polyfill/noConflict " + "instead to bypass the warning.");
}

_global["default"]._babelPolyfill = true;

const uuidv1 = require('uuid').v1;
const getTransceiver = (pc, kind) => {
    let transceiver = null;
    let transceivers = pc.getTransceivers();
    if (transceivers && transceivers.length > 0) {
        for (let t of transceivers) {
            if ((t.sender && t.sender.track && t.sender.track.kind === kind) ||
                (t.receiver && t.receiver.track && t.receiver.track.kind === kind)) {
                transceiver = t;
                break;
            }
        }
    }
    return transceiver;
};
const waitUntil = (f, timeout, defaultInterval) => __awaiter(void 0, void 0, void 0, function* () {
    let interval = defaultInterval || 1000;
    let time = 0;
    const w = (resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        let done = false;
        try {
            done = yield f(time);
        }
        catch (e) {
        }
        if (done) {
            resolve();
        }
        else if (timeout && time > timeout) {
            const error = new Error('waitUntil - timeout');
            reject(error);
        }
        else {
            time += interval;
            setTimeout(() => w(resolve, reject), interval);
        }
    });
    return new Promise(w);
});
class JanusPublisher extends EventTarget {
    constructor(options) {
        super();
        this.initialize = () => __awaiter(this, void 0, void 0, function* () {
            yield this.attach();
            const jsep = yield this.createOffer(this.mediaConstraints);
            const response = yield this.joinandconfigure(jsep);
            return response.load.data.publishers;
        });
        this.terminate = () => __awaiter(this, void 0, void 0, function* () {
            const event = new Event('terminated');
            if (this.pc) {
                clearInterval(this.statsInterval);
                this.pc.close();
            }
            if (this.stream) {
                const tracks = this.stream.getTracks();
                tracks.forEach((track) => {
                    track.stop();
                });
            }
            this.dispatchEvent(event);
            if (this.publishing) {
                yield this.unpublish();
            }
            if (this.attached) {
                yield this.hangup();
                yield this.detach();
            }
        });
        this.renegotiate = ({ audio, video, mediaConstraints }) => __awaiter(this, void 0, void 0, function* () {
            const jsep = yield this.createOffer(mediaConstraints || this.mediaConstraints);
            this.logger.json(jsep);
            const configured = yield this.configure({
                jsep,
                audio,
                video
            });
            this.logger.json(configured);
            return configured;
        });
        this.createPeerConnection = (configuration) => {
            this.pc = new RTCPeerConnection(configuration);
            this.statsInterval = setInterval(() => {
                this.pc.getStats()
                    .then((stats) => {
                    this.stats = stats;
                })
                    .catch((error) => {
                    this.logger.error(error);
                });
            }, 3000);
            this.pc.onicecandidate = (event) => {
                if (!event.candidate) {
                    this.sendTrickleCandidate({
                        "completed": true
                    });
                }
                else {
                    const candidate = {
                        "candidate": event.candidate.candidate,
                        "sdpMid": event.candidate.sdpMid,
                        "sdpMLineIndex": event.candidate.sdpMLineIndex
                    };
                    this.sendTrickleCandidate(candidate);
                }
            };
            this.pc.oniceconnectionstatechange = (e) => {
                this.iceConnectionState = this.pc.iceConnectionState;
                if (this.pc.iceConnectionState === "disconnected") {
                    const event = new Event("disconnected");
                    this.dispatchEvent(event);
                }
                this.logger.info(`[${this.ptype}] oniceconnectionstatechange ${this.pc.iceConnectionState}`);
            };
            this.pc.onnegotiationneeded = () => {
                this.logger.info(`[${this.ptype}] onnegotiationneeded ${this.pc.signalingState}`);
            };
            this.pc.onicegatheringstatechange = e => {
                this.iceGatheringState = this.pc.iceGatheringState;
                this.logger.info(`[${this.ptype}] onicegatheringstatechange ${this.pc.iceGatheringState}`);
            };
            this.pc.onsignalingstatechange = e => {
                this.signalingState = this.pc.signalingState;
                this.logger.info(`[${this.ptype}] onicegatheringstatechange ${this.pc.signalingState}`);
            };
            this.pc.onicecandidateerror = error => {
                this.logger.error(error);
            };
            this.pc.onstatsended = stats => {
                this.logger.json(stats);
            };
        };
        this.sendTrickleCandidate = (candidate) => {
            const request = {
                type: "candidate",
                load: {
                    room_id: this.room_id,
                    handle_id: this.handle_id,
                    candidate
                }
            };
            return this.transaction(request);
        };
        this.receiveTrickleCandidate = (candidate) => {
            this.candidates.push(candidate);
        };
        this.createOffer = (mediaConstraints) => __awaiter(this, void 0, void 0, function* () {
            const media = mediaConstraints || {
                audio: true,
                video: true
            };
            //why - send encoding crashes puppeteer ???  
            const videoOptions = {
                direction: "sendonly",
            };
            const audioOptions = {
                direction: "sendonly"
            };
            const stream = yield navigator.mediaDevices.getUserMedia(media);
            this.stream = stream;
            let tracks = stream.getTracks();
            let videoTrack = tracks.find((t) => t.kind === "video");
            let audioTrack = tracks.find((t) => t.kind === "audio");
            let vt = getTransceiver(this.pc, "video");
            let at = getTransceiver(this.pc, "audio");
            if (vt && at) {
                vt.direction = "sendonly";
                at.direction = "sendonly";
            }
            else {
                vt = this.pc.addTransceiver("video", videoOptions);
                at = this.pc.addTransceiver("audio", audioOptions);
            }
            yield vt.sender.replaceTrack(videoTrack);
            yield at.sender.replaceTrack(audioTrack);
            const offer = yield this.pc.createOffer({});
            this.pc.setLocalDescription(offer);
            return offer;
        });
        this.attach = () => __awaiter(this, void 0, void 0, function* () {
            const request = {
                type: "attach",
                load: {
                    room_id: this.room_id
                }
            };
            const result = yield this.transaction(request);
            this.handle_id = result.load;
            this.attached = true;
            return result;
        });
        this.join = () => {
            const request = {
                type: "join",
                load: {
                    id: this.id,
                    room_id: this.room_id,
                    handle_id: this.handle_id,
                    ptype: this.ptype
                }
            };
            return this.transaction(request);
        };
        this.configure = (data) => __awaiter(this, void 0, void 0, function* () {
            const request = {
                type: "configure",
                load: {
                    room_id: this.room_id,
                    handle_id: this.handle_id,
                    ptype: this.ptype
                }
            };
            if (data.jsep) {
                request.load.jsep = data.jsep;
            }
            if (data.audio !== undefined) {
                request.load.audio = data.audio;
            }
            if (data.video !== undefined) {
                request.load.video = data.video;
            }
            const configureResponse = yield this.transaction(request);
            if (configureResponse.load.jsep) {
                yield this.pc.setRemoteDescription(configureResponse.load.jsep);
            }
            if (this.candidates) {
                this.candidates.forEach((candidate) => {
                    if (!candidate || candidate.completed) {
                        this.pc.addIceCandidate(null);
                    }
                    else {
                        this.pc.addIceCandidate(candidate);
                    }
                });
                this.candidates = [];
            }
            this.publishing = true;
            return configureResponse;
        });
        this.publish = ({ jsep }) => __awaiter(this, void 0, void 0, function* () {
            const request = {
                type: "publish",
                load: {
                    room_id: this.room_id,
                    jsep
                }
            };
            const response = yield this.transaction(request);
            yield this.pc.setRemoteDescription(response.load.jsep);
            if (this.candidates) {
                this.candidates.forEach((candidate) => {
                    if (!candidate || candidate.completed) {
                        this.pc.addIceCandidate(null);
                    }
                    else {
                        this.pc.addIceCandidate(candidate);
                    }
                });
                this.candidates = [];
            }
            this.publishing = true;
        });
        this.joinandconfigure = (jsep) => __awaiter(this, void 0, void 0, function* () {
            const request = {
                type: "joinandconfigure",
                load: {
                    id: this.id,
                    room_id: this.room_id,
                    handle_id: this.handle_id,
                    ptype: this.ptype,
                    jsep
                }
            };
            const configureResponse = yield this.transaction(request);
            yield this.pc.setRemoteDescription(configureResponse.load.jsep);
            if (this.candidates) {
                this.candidates.forEach((candidate) => {
                    if (!candidate || candidate.completed) {
                        this.pc.addIceCandidate(null);
                    }
                    else {
                        this.pc.addIceCandidate(candidate);
                    }
                });
                this.candidates = [];
            }
            this.publishing = true;
            return configureResponse;
        });
        this.unpublish = () => __awaiter(this, void 0, void 0, function* () {
            const request = {
                type: "unpublish",
                load: {
                    room_id: this.room_id,
                    handle_id: this.handle_id
                }
            };
            this.publishing = false;
            const result = yield this.transaction(request);
            return result;
        });
        this.detach = () => __awaiter(this, void 0, void 0, function* () {
            const request = {
                type: "detach",
                load: {
                    room_id: this.room_id,
                    handle_id: this.handle_id
                }
            };
            this.publishing = false;
            const result = yield this.transaction(request);
            return result;
        });
        this.hangup = () => __awaiter(this, void 0, void 0, function* () {
            const request = {
                type: "hangup",
                load: {
                    room_id: this.room_id,
                    handle_id: this.handle_id
                }
            };
            this.publishing = false;
            const result = yield this.transaction(request);
            return result;
        });
        this.leave = () => __awaiter(this, void 0, void 0, function* () {
            const request = {
                type: "leave",
                load: {
                    room_id: this.room_id
                }
            };
            this.publishing = false;
            const result = yield this.transaction(request);
            return result;
        });
        const { transaction, room_id, user_id, rtcConfiguration, mediaConstraints, logger } = options;
        this.ptype = "publisher";
        this.rtcConfiguration = rtcConfiguration;
        this.mediaConstraints = mediaConstraints;
        this.id = user_id;
        this.transaction = transaction;
        this.room_id = room_id;
        this.publishing = false;
        this.volume = {
            value: null,
            timer: null
        };
        this.bitrate = {
            value: null,
            bsnow: null,
            bsbefore: null,
            tsnow: null,
            tsbefore: null,
            timer: null
        };
        this.logger = logger;
        this.handle_id = null;
        this.createPeerConnection(this.rtcConfiguration);
    }
}
class JanusSubscriber extends EventTarget {
    constructor(options) {
        super();
        this.initialize = (options) => __awaiter(this, void 0, void 0, function* () {
            yield this.attach();
            const { load } = yield this.join();
            const { jsep } = load;
            const answer = yield this.createAnswer(jsep, options);
            const started = yield this.start(answer);
            return started;
        });
        this.terminate = () => __awaiter(this, void 0, void 0, function* () {
            const event = new Event('terminated');
            this.dispatchEvent(event);
            if (this.pc) {
                clearInterval(this.statsInterval);
                this.pc.close();
            }
            if (this.attached) {
                yield this.hangup();
                yield this.detach();
            }
        });
        this.createPeerConnection = (configuration) => {
            this.pc = new RTCPeerConnection(configuration);
            this.statsInterval = setInterval(() => {
                this.pc.getStats()
                    .then((stats) => {
                    this.stats = stats;
                })
                    .catch((error) => {
                    this.logger.error(error);
                });
            }, 3000);
            this.pc.onicecandidate = (event) => {
                if (!event.candidate) {
                    this.sendTrickleCandidate({
                        "completed": true
                    });
                }
                else {
                    const candidate = {
                        "candidate": event.candidate.candidate,
                        "sdpMid": event.candidate.sdpMid,
                        "sdpMLineIndex": event.candidate.sdpMLineIndex
                    };
                    this.sendTrickleCandidate(candidate);
                }
            };
            this.pc.ontrack = (event) => {
                if (!event.streams) {
                    return;
                }
                const stream = event.streams[0];
                this.stream = stream;
                stream.onaddtrack = (t) => {
                };
                stream.onremovetrack = (t) => {
                };
                event.track.onended = (e) => {
                    this.logger.info('[subscriber] track onended');
                };
                event.track.onmute = (e) => {
                };
                event.track.onunmute = (e) => {
                };
            };
            this.pc.onnegotiationneeded = () => {
                this.iceConnectionState = this.pc.iceConnectionState;
            };
            this.pc.oniceconnectionstatechange = (event) => {
                this.iceConnectionState = this.pc.iceConnectionState;
                if (this.pc.iceConnectionState === "disconnected") {
                    const event = new Event("disconnected");
                    this.dispatchEvent(event);
                }
                this.logger.info(`oniceconnectionstatechange ${this.pc.iceConnectionState}`);
            };
            this.pc.onicecandidateerror = error => {
                this.logger.error(error);
            };
            this.pc.onicegatheringstatechange = e => {
                this.iceGatheringState = this.pc.iceGatheringState;
                this.logger.info(this.pc.iceGatheringState);
            };
            this.pc.onsignalingstatechange = e => {
                this.signalingState = this.pc.signalingState;
                this.logger.info(`onsignalingstatechange ${this.pc.signalingState}`);
            };
            this.pc.onstatsended = stats => {
                this.logger.info(stats);
            };
        };
        this.sendTrickleCandidate = (candidate) => {
            const request = {
                type: "candidate",
                load: {
                    room_id: this.room_id,
                    handle_id: this.handle_id,
                    candidate
                }
            };
            return this.transaction(request);
        };
        this.receiveTrickleCandidate = (candidate) => {
            this.candidates.push(candidate);
        };
        this.createAnswer = (jsep, options) => __awaiter(this, void 0, void 0, function* () {
            yield this.pc.setRemoteDescription(jsep);
            if (this.candidates) {
                this.candidates.forEach((candidate) => {
                    if (candidate.completed || !candidate) {
                        this.pc.addIceCandidate(null);
                    }
                    else {
                        this.pc.addIceCandidate(candidate);
                    }
                });
                this.candidates = [];
            }
            let vt = getTransceiver(this.pc, "video");
            let at = getTransceiver(this.pc, "audio");
            if (vt && at) {
                at.direction = "recvonly";
                vt.direction = "recvonly";
            }
            else {
                vt = this.pc.addTransceiver("video", { direction: "recvonly" });
                at = this.pc.addTransceiver("audio", { direction: "recvonly" });
            }
            const answer = yield this.pc.createAnswer(options);
            this.pc.setLocalDescription(answer);
            return answer;
        });
        this.attach = () => __awaiter(this, void 0, void 0, function* () {
            const request = {
                type: "attach",
                load: {
                    room_id: this.room_id
                }
            };
            const result = yield this.transaction(request);
            this.handle_id = result.load;
            this.attached = true;
            return result;
        });
        this.join = () => {
            const request = {
                type: "join",
                load: {
                    room_id: this.room_id,
                    handle_id: this.handle_id,
                    ptype: "subscriber",
                    feed: this.feed
                }
            };
            return this.transaction(request)
                .then((response) => {
                this.joined = true;
                return response;
            });
        };
        this.configure = (data) => __awaiter(this, void 0, void 0, function* () {
            const request = {
                type: "configure",
                load: {
                    room_id: this.room_id,
                    handle_id: this.handle_id,
                    ptype: this.ptype
                }
            };
            if (data.jsep) {
                request.load.jsep = data.jsep;
            }
            if (data.audio !== undefined) {
                request.load.audio = data.audio;
            }
            if (data.video !== undefined) {
                request.load.video = data.video;
            }
            const configureResponse = yield this.transaction(request);
            return configureResponse;
        });
        this.start = (jsep) => {
            const request = {
                type: "start",
                load: {
                    room_id: this.room_id,
                    handle_id: this.handle_id,
                    answer: jsep
                }
            };
            return this.transaction(request);
        };
        this.hangup = () => __awaiter(this, void 0, void 0, function* () {
            const request = {
                type: "hangup",
                load: {
                    room_id: this.room_id,
                    handle_id: this.handle_id
                }
            };
            const result = yield this.transaction(request);
            return result;
        });
        this.detach = () => __awaiter(this, void 0, void 0, function* () {
            const request = {
                type: "detach",
                load: {
                    room_id: this.room_id,
                    handle_id: this.handle_id
                }
            };
            this.attached = false;
            const result = yield this.transaction(request);
            this.handle_id = undefined;
            return result;
        });
        this.leave = () => __awaiter(this, void 0, void 0, function* () {
            const request = {
                type: "leave",
                load: {
                    room_id: this.room_id
                }
            };
            this.attached = false;
            const result = yield this.transaction(request);
            return result;
        });
        const { transaction, room_id, feed, rtcConfiguration, logger } = options;
        this.id = feed;
        this.feed = feed;
        this.transaction = transaction;
        this.room_id = room_id;
        this.ptype = "subscriber";
        this.attached = false;
        this.volume = {
            value: null,
            timer: null
        };
        this.bitrate = {
            value: null,
            bsnow: null,
            bsbefore: null,
            tsnow: null,
            tsbefore: null,
            timer: null
        };
        this.logger = logger;
        this.createPeerConnection(rtcConfiguration);
    }
}
class JanusClient {
    constructor(options) {
        this.initialize = () => {
            if (this.terminating) {
                throw new Error('termination in progress...');
            }
            if (this.connected) {
                throw new Error('already initialized...');
            }
            if (this.initializing) {
                throw new Error('initialization in progress...');
            }
            this.logger.success(`initialize... ${this.server}`);
            this.initializing = true;
            this.ws = new this.WebSocket(this.server, [], this.socketOptions);
            this.ws.addEventListener('message', this.onMessage);
            //this.ws.addEventListener('open', this.onOpen); ???
            this.ws.addEventListener('close', this.onClose);
            this.ws.addEventListener('error', this.onError);
            return new Promise((resolve) => {
                this.notifyConnected = () => resolve();
            });
        };
        this.terminate = () => __awaiter(this, void 0, void 0, function* () {
            if (!this.initializing && !this.connected) {
                throw new Error('already terminated...');
            }
            if (this.terminating) {
                throw new Error('termination in progress...');
            }
            this.terminating = true;
            yield this.cleanup();
            this.logger.info(`terminate: remove event listeners...`);
            this.ws.removeEventListener('message', this.onMessage);
            this.ws.removeEventListener('open', this.onOpen);
            this.ws.removeEventListener('close', this.onClose);
            this.ws.removeEventListener('error', this.onError);
            if (this.notifyConnected) {
                this.notifyConnected({
                    cancel: true
                });
                delete this.notifyConnected;
            }
            this.logger.info(`terminate: close connection...`);
            this.ws.close();
            this.onClose();
            this.ws = undefined;
            this.terminating = false;
        });
        this.replaceVideoTrack = (deviceId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const tracks = this.publisher.stream.getVideoTracks();
                const track = tracks[0];
                yield track.stop();
            }
            catch (error) {
                this.onError(error);
            }
            let vt = getTransceiver(this.publisher.pc, "video");
            const mediaStream = yield navigator.mediaDevices.getUserMedia({
                audio: true,
                video: {
                    deviceId: {
                        exact: deviceId
                    }
                }
            });
            this.publisher.stream = mediaStream;
            const t = mediaStream.getVideoTracks()[0];
            yield vt.sender.replaceTrack(t);
        });
        this.onClose = () => {
            this.logger.info(`connection closed...`);
            this.connected = false;
            this.initializing = false;
            clearInterval(this.keepAlive);
            this.keepAlive = undefined;
        };
        this.leave = () => __awaiter(this, void 0, void 0, function* () {
            if (this.terminating) {
                throw new Error('termination in progress...');
            }
            yield this.cleanup();
        });
        this.cleanup = () => __awaiter(this, void 0, void 0, function* () {
            if (this.publisher) {
                this.logger.info(`terminate publisher ${this.publisher.handle_id}...`);
                try {
                    yield this.publisher.terminate();
                    this.publisher.transaction = (...args) => Promise.resolve();
                    delete this.publisher;
                }
                catch (error) {
                    this.onError(error);
                }
            }
            for (const id in this.subscribers) {
                const subscriber = this.subscribers[id];
                const event = new Event('leaving');
                subscriber.dispatchEvent(event);
                this.logger.info(`terminate subscriber ${subscriber.handle_id}...`);
                try {
                    yield subscriber.terminate();
                    subscriber.transaction = (...args) => Promise.resolve();
                    delete this.subscribers[subscriber.feed];
                }
                catch (error) {
                    this.onError(error);
                }
            }
            this.subscribers = {};
        });
        this.join = (room_id, mediaConstraints) => __awaiter(this, void 0, void 0, function* () {
            this.room_id = room_id;
            if (this.publisher) {
                try {
                    yield this.publisher.terminate();
                    this.publisher.transaction = (...args) => Promise.resolve();
                    delete this.publisher;
                }
                catch (error) {
                    this.onError(error);
                }
            }
            try {
                this.publisher = new JanusPublisher({
                    room_id: this.room_id,
                    user_id: this.user_id,
                    transaction: this.transaction,
                    logger: this.logger,
                    mediaConstraints,
                    rtcConfiguration: this.publisherRtcConfiguration
                });
                const publishers = yield this.publisher.initialize();
                this.onPublisher(this.publisher);
                if (!publishers || !Array.isArray(publishers)) {
                    const error = new Error(`join - publishers incorrect format...`);
                    this.onError(error);
                    return;
                }
                this.onPublishers(publishers);
            }
            catch (error) {
                this.onError(error);
            }
        });
        this.onOpen = () => {
            this.logger.success(`connection established...`);
            this.initializing = false;
            this.connected = true;
            if (this.notifyConnected) {
                this.notifyConnected();
                delete this.notifyConnected;
            }
            this.keepAlive = setInterval(() => {
                this.transaction(({ type: 'keepalive' }))
                    .catch((error) => {
                    this.onError(error);
                });
            }, this.keepAliveInterval);
        };
        this.onMessage = (response) => {
            if (response.data === 'connected') {
                this.onOpen();
                return;
            }
            let message = null;
            try {
                message = JSON.parse(response.data);
            }
            catch (error) {
                this.onError(error);
            }
            if (message) {
                const id = message.transaction;
                const isEvent = !id;
                if (isEvent) {
                    this.onEvent(message);
                }
                else {
                    const resolve = this.calls[id];
                    if (resolve) {
                        resolve(message);
                    }
                }
            }
        };
        this.onEvent = (json) => __awaiter(this, void 0, void 0, function* () {
            if (json.type === "trickle") {
                this.onTrickle(json);
            }
            else if (json.type === "publishers") {
                const publishers = json.data;
                if (!publishers || !Array.isArray(publishers)) {
                    this.logger.json(json);
                    const error = new Error(`onEvent - publishers incorrect format...`);
                    this.onError(error);
                    return;
                }
                this.onPublishers(publishers);
            }
            else if (json.type === "media") {
                this.onMedia(json);
            }
            else if (json.type === "leaving") {
                this.onLeaving(json);
            }
            else if (json.type === "internal") {
                this.onInternal(json);
            }
        });
        this.onTrickle = (json) => {
            const { sender, data } = json;
            if (!this.publisher) {
                const error = new Error(`onTrickle - publisher undefined for ${sender}...`);
                this.onError(error);
                return;
            }
            if (!sender) {
                const error = new Error(`onTrickle - sender is undefined...`);
                this.onError(error);
                return;
            }
            if (this.publisher.handle_id == sender) {
                this.logger.success(`received trickle candidate for publisher ${sender}...`);
                this.publisher.receiveTrickleCandidate(data);
            }
            else {
                for (const id in this.subscribers) {
                    const subscriber = this.subscribers[id];
                    if (subscriber.handle_id == sender) {
                        this.logger.success(`received trickle candidate for subscriber ${sender}...`);
                        subscriber.receiveTrickleCandidate(data);
                    }
                }
            }
        };
        this.onPublishers = (publishers) => __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < publishers.length; i++) {
                const publisher = publishers[i];
                const feed = publisher.id;
                if (this.subscribers[feed]) {
                    this.logger.error(`onPublishers - subscriber ${feed} already attached for room ${this.room_id}`);
                    continue;
                }
                const subscriber = new JanusSubscriber({
                    transaction: this.transaction,
                    room_id: this.room_id,
                    feed,
                    logger: this.logger,
                    rtcConfiguration: this.subscriberRtcConfiguration
                });
                this.subscribers[feed] = subscriber;
                this.onSubscriber(subscriber);
            }
        });
        this.onMedia = (json) => {
            const { sender, data } = json;
            if (!this.publisher) {
                const error = new Error(`onMedia - publisher undefined for ${sender}...`);
                this.onError(error);
                return;
            }
            if (!sender) {
                const error = new Error(`onMedia - sender is undefined...`);
                this.onError(error);
                return;
            }
            const event = new Event('media', data);
            if (this.publisher.handle_id == sender) {
                this.publisher.dispatchEvent(event);
            }
            else {
                for (const id in this.subscribers) {
                    const subscriber = this.subscribers[id];
                    if (subscriber.handle_id == sender) {
                        subscriber.dispatchEvent(event);
                    }
                }
            }
        };
        this.onLeaving = (json) => __awaiter(this, void 0, void 0, function* () {
            if (!json.data) {
                this.logger.json(json);
                const error = new Error(`onLeaving - data is undefined...`);
                this.onError(error);
                return;
            }
            const { leaving } = json.data;
            if (!this.publisher) {
                const error = new Error(`onLeaving - publisher is undefined...`);
                this.onError(error);
                return;
            }
            if (!leaving) {
                const error = new Error(`onLeaving - leaving is undefined...`);
                this.onError(error);
                return;
            }
            const event = new Event('leaving');
            for (const id in this.subscribers) {
                const subscriber = this.subscribers[id];
                if (subscriber.feed == leaving) {
                    delete this.subscribers[subscriber.feed];
                    subscriber.transaction = (...args) => Promise.resolve();
                    try {
                        yield subscriber.terminate();
                    }
                    catch (error) {
                        this.onError(error);
                    }
                    subscriber.dispatchEvent(event);
                }
            }
        });
        this.onInternal = (json) => {
            this.logger.json(json);
            if (this.publisher && this.publisher.handle_id == json.sender) ;
            else {
                for (const id in this.subscribers) {
                    const subscriber = this.subscribers[id];
                    if (subscriber && subscriber.handle_id == json.sender) ;
                }
            }
        };
        this.mute = () => __awaiter(this, void 0, void 0, function* () {
            if (!this.publisher) {
                throw new Error('mute - publisher is undefined...');
            }
            return yield this.publisher.configure({
                audio: false
            });
        });
        this.unmute = () => __awaiter(this, void 0, void 0, function* () {
            if (!this.publisher) {
                throw new Error('unmute - publisher is undefined...');
            }
            return yield this.publisher.configure({
                audio: true
            });
        });
        this.pause = () => __awaiter(this, void 0, void 0, function* () {
            if (!this.publisher) {
                throw new Error('pause - publisher is undefined...');
            }
            return yield this.publisher.configure({
                video: false
            });
        });
        this.resume = () => __awaiter(this, void 0, void 0, function* () {
            if (!this.publisher) {
                throw new Error('resume - publisher is undefined...');
            }
            return yield this.publisher.configure({
                video: true
            });
        });
        this.transaction = (request) => __awaiter(this, void 0, void 0, function* () {
            //TODO review
            if (!this.connected) {
                this.logger.error(`transaction - not connected...`);
                this.logger.json(request);
                if (this.initializing) {
                    this.logger.info(`transaction - wait until connected...`);
                    yield waitUntil(() => Promise.resolve(this.connected), 30000, 500);
                }
                else {
                    const error = new Error(`client should be initialized before you can make transaction`);
                    this.onError(error);
                    return;
                    //this.logger.info(`transaction - initialize...`);
                    //await this.initialize();
                }
            }
            const timeout = this.transactionTimeout;
            const id = uuidv1();
            request.transaction = id;
            let r = null;
            let p = null;
            try {
                r = JSON.stringify(request);
            }
            catch (error) {
                return Promise.reject(error);
            }
            p = new Promise((resolve, reject) => {
                let t = setTimeout(() => {
                    if (!this.connected && !this.initializing) {
                        this.initialize();
                    }
                    delete this.calls[id];
                    const error = new Error(`${request.type} - timeout`);
                    reject(error);
                }, timeout);
                const f = (message) => {
                    if (message.transaction === id) {
                        if (timeout) {
                            clearTimeout(t);
                        }
                        delete this.calls[id];
                        if (message.type === "error") {
                            this.logger.error(request);
                            const error = new Error(message.load);
                            reject(error);
                        }
                        else {
                            resolve(message);
                        }
                    }
                };
                this.calls[id] = f;
            });
            this.ws.send(r);
            return p;
        });
        this.getRooms = () => this.transaction({ type: "rooms" });
        this.createRoom = (description, bitrate, bitrate_cap, videocodec, vp9_profile) => {
            return this.transaction({
                type: "create_room",
                load: {
                    description,
                    bitrate,
                    bitrate_cap,
                    videocodec,
                    vp9_profile
                }
            });
        };
        const { onSubscriber, onPublisher, onError, WebSocket, logger, server, subscriberRtcConfiguration, publisherRtcConfiguration, transactionTimeout, keepAliveInterval, user_id } = options;
        this.user_id = user_id;
        this.WebSocket = WebSocket;
        this.logger = logger;
        this.server = server;
        this.ws = null;
        this.initializing = false;
        this.connected = false;
        this.terminating = false;
        this.subscribers = {};
        this.calls = {};
        this.subscriberRtcConfiguration = subscriberRtcConfiguration;
        this.publisherRtcConfiguration = publisherRtcConfiguration;
        this.onError = onError;
        this.onPublisher = onPublisher;
        this.onSubscriber = onSubscriber;
        this.socketOptions = {
            WebSocket,
            connectionTimeout: 1000,
            maxRetries: 10
        };
        this.transactionTimeout = transactionTimeout;
        this.keepAliveInterval = keepAliveInterval;
        this.logger.enable();
    }
}

const uuidv1$1 = require('uuid').v1;
class Video extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.video.srcObject = this.props.stream;
        this.video.play();
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.stream !== this.props.stream) {
            this.video.srcObject = nextProps.stream;
            this.video.play();
        }
    }
    render() {
        const { id, muted, style } = this.props;
        return React.createElement("video", { id: id, muted: muted, style: style, ref: (video) => { this.video = video; } });
    }
}
class JanusVideoRoom extends React.Component {
    constructor(props) {
        super(props);
        this.cleanup = () => {
            return this.client.terminate()
                .then(() => {
                this.connected = false;
                return this.props.onDisconnected();
            })
                .catch((error) => {
                this.props.onError(error);
            });
        };
        this.onChangeCamera = () => __awaiter(this, void 0, void 0, function* () {
            if (!this.props.camera ||
                !this.client ||
                !this.client.publisher ||
                !this.client.publisher.pc ||
                !this.client.publisher.stream) {
                return;
            }
            try {
                yield this.client.replaceVideoTrack(this.props.camera.value);
            }
            catch (error) {
                this.props.onError(error);
            }
            this.forceUpdate();
        });
        this.onChangeRoom = (prevProps) => __awaiter(this, void 0, void 0, function* () {
            const { mediaConstraints, onError } = this.props;
            const leave = prevProps.room && !this.props.room;
            const join = !prevProps.room && this.props.room;
            const change = prevProps.room && this.props.room && prevProps.room !== this.props.room;
            let constraints = null;
            if (this.props.camera) {
                constraints = {
                    video: {
                        deviceId: {
                            exact: this.props.camera.deviceId
                        }
                    }
                };
            }
            else if (mediaConstraints) {
                constraints = mediaConstraints;
            }
            else {
                constraints = {
                    video: true,
                    audio: true
                };
            }
            if (leave || change) {
                try {
                    yield this.client.leave();
                }
                catch (error) {
                    onError(error);
                }
            }
            if (change || join) {
                try {
                    yield this.client.join(this.props.room, mediaConstraints);
                }
                catch (error) {
                    onError(error);
                }
            }
            this.forceUpdate();
        });
        this.onPublisherTerminated = (publisher) => () => {
            this.props.onPublisherDisconnected(publisher);
        };
        this.onPublisherDisconnected = (publisher) => () => {
            this.props.onPublisherDisconnected(publisher);
        };
        this.onPublisher = (publisher) => __awaiter(this, void 0, void 0, function* () {
            publisher.addEventListener("terminated", this.onPublisherTerminated(publisher));
            publisher.addEventListener("disconnected", this.onPublisherDisconnected(publisher));
            this.props.onConnected(publisher);
            this.forceUpdate();
        });
        this.onSubscriberTerminated = (subscriber) => () => {
            this.props.onParticipantLeft(subscriber);
            const subscribers = this.getSubscribers();
            if (this.nParticipants !== subscribers.length) {
                this.nParticipants = subscribers.length;
                this.onParticipantsAmountChange();
            }
            this.forceUpdate();
        };
        this.onSubscriberLeaving = (subscriber) => () => {
            this.props.onParticipantLeft(subscriber);
            const subscribers = this.getSubscribers();
            if (this.nParticipants !== subscribers.length) {
                this.nParticipants = subscribers.length;
                this.onParticipantsAmountChange();
            }
            this.forceUpdate();
        };
        this.onSubscriberDisconnected = (subscriber) => () => {
            this.props.onParticipantLeft(subscriber);
            const subscribers = this.getSubscribers();
            if (this.nParticipants !== subscribers.length) {
                this.nParticipants = subscribers.length;
                this.onParticipantsAmountChange();
            }
            this.forceUpdate();
        };
        this.onSubscriber = (subscriber) => __awaiter(this, void 0, void 0, function* () {
            subscriber.addEventListener("terminated", this.onSubscriberTerminated(subscriber));
            subscriber.addEventListener("leaving", this.onSubscriberLeaving(subscriber));
            subscriber.addEventListener("disconnected", this.onSubscriberLeaving(subscriber));
            try {
                yield subscriber.initialize();
                this.props.onParticipantJoined(subscriber);
                const subscribers = this.getSubscribers();
                if (this.nParticipants !== subscribers.length) {
                    this.nParticipants = subscribers.length;
                    this.onParticipantsAmountChange();
                }
                this.forceUpdate();
            }
            catch (error) {
                this.props.onError(error);
            }
        });
        this.renderVideo = (subscriber) => {
            if (this.props.renderStream) {
                return this.props.renderStream(subscriber);
            }
            return React.createElement("div", { key: `subscriber-${subscriber.id}`, style: this.state.styles.videoContainer },
                React.createElement(Video, { id: subscriber.id, muted: false, style: this.state.styles.video, stream: subscriber.stream }));
        };
        this.renderLocalVideo = () => {
            const publisher = this.client.publisher;
            if (!publisher) {
                return null;
            }
            if (this.props.renderLocalStream) {
                return this.props.renderLocalStream(publisher);
            }
            this.logger.info('render publisher', publisher);
            return (React.createElement("div", { style: this.state.styles.localVideoContainer },
                React.createElement(Video, { id: publisher.id, muted: true, style: this.state.styles.localVideo, stream: publisher.stream })));
        };
        this.getSubscribers = () => {
            if (!this.client || !this.client.subscribers) {
                return [];
            }
            return Object.values(this.client.subscribers).filter((element) => element && element.ptype === "subscriber");
        };
        this.renderContainer = () => {
            if (!this.client || !this.client.subscribers) {
                return null;
            }
            const subscribers = this.getSubscribers();
            const content = (React.createElement(React.Fragment, null,
                this.renderLocalVideo(),
                subscribers.map((subscriber) => {
                    return this.renderVideo(subscriber);
                })));
            if (this.props.renderContainer) {
                return this.props.renderContainer(content);
            }
            return React.createElement("div", { style: this.state.styles.container }, content);
        };
        this.onParticipantsAmountChange = () => {
            const { getCustomStyles } = this.props;
            if (getCustomStyles) {
                const styles = getCustomStyles(this.nParticipants);
                if (styles) {
                    this.setState({
                        styles: Object.assign(Object.assign({}, this.defaultStyles), styles)
                    });
                }
            }
        };
        this.loggerEnabled = true;
        let customStyles = {};
        if (this.props.getCustomStyles) {
            customStyles = this.props.getCustomStyles(0);
        }
        this.defaultStyles = {
            container: {
                height: `100%`,
                width: `100%`,
                position: `relative`
            },
            video: {
                width: `100%`,
            },
            videoContainer: {
                width: `100%`,
                height: `100%`
            },
            localVideo: {
                width: `200px`,
                height: `auto`
            },
            localVideoContainer: {
                position: `absolute`,
                top: `50px`,
                right: `50px`
            }
        };
        this.state = {
            styles: Object.assign(Object.assign({}, this.defaultStyles), customStyles)
        };
        this.logger = {
            enable: () => {
                this.loggerEnabled = true;
            },
            disable: () => {
                this.loggerEnabled = false;
            },
            success: (...args) => {
                if (this.loggerEnabled) {
                    if (this.props.logger && this.props.logger.success) {
                        this.props.logger.success(...args);
                    }
                    else {
                        console.log(...args);
                    }
                }
            },
            info: (...args) => {
                if (this.loggerEnabled) {
                    if (this.props.logger && this.props.logger.info) {
                        this.props.logger.info(...args);
                    }
                    else {
                        console.log(...args);
                    }
                }
            },
            error: (error) => {
                if (this.loggerEnabled) {
                    if (this.props.logger && this.props.logger.error) {
                        this.props.logger.error(error);
                    }
                    else {
                        console.error(error);
                    }
                }
            },
            json: (...args) => {
                if (this.loggerEnabled) {
                    if (this.props.logger && this.props.logger.json) {
                        this.props.logger.json(...args);
                    }
                    else {
                        console.log(...args);
                    }
                }
            },
            tag: (tag, type) => (...args) => {
                if (this.loggerEnabled) {
                    console.log(tag, type, ...args);
                }
            }
        };
    }
    componentDidMount() {
        window.addEventListener('beforeunload', this.cleanup);
        const { server } = this.props;
        const rtcConfiguration = this.props.rtcConfiguration || {
            "iceServers": [{
                    urls: "stun:stun.voip.eutelia.it:3478"
                }],
            "sdpSemantics": "unified-plan"
        };
        const user_id = this.props.user_id || uuidv1$1();
        this.client = new JanusClient({
            onPublisher: this.onPublisher,
            onSubscriber: this.onSubscriber,
            onError: (error) => this.props.onError(error),
            user_id,
            server,
            logger: this.logger,
            WebSocket: ReconnectingWebSocket,
            subscriberRtcConfiguration: rtcConfiguration,
            publisherRtcConfiguration: rtcConfiguration,
            transactionTimeout: 15000,
            keepAliveInterval: 10000
        });
        this.client.initialize()
            .then(() => (this.client.getRooms()))
            .then(({ load }) => {
            this.props.onRooms(load);
            this.connected = true;
            this.forceUpdate();
        })
            .catch((error) => {
            this.props.onError(error);
        });
    }
    componentDidUpdate(prevProps) {
        if (prevProps.room !== this.props.room) {
            this.onChangeRoom(prevProps);
        }
        if (prevProps.camera !== this.props.camera) {
            this.onChangeCamera();
        }
    }
    componentDidCatch(error, info) {
        this.props.onError(error);
        this.logger.info(info);
    }
    componentWillUnmount() {
        this.cleanup();
        window.removeEventListener('beforeunload', this.cleanup);
    }
    render() {
        if (!this.client) {
            return null;
        }
        return this.renderContainer();
    }
}

exports.JanusVideoRoom = JanusVideoRoom;
