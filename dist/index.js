(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
    typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global['react-janus-videoroom'] = {}, global.React));
}(this, (function (exports, React) { 'use strict';

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
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

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

    var extendStatics$1 = function(d, b) {
        extendStatics$1 = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics$1(d, b);
    };

    function __extends$1(d, b) {
        extendStatics$1(d, b);
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
        __extends$1(ErrorEvent, _super);
        function ErrorEvent(error, target) {
            var _this = _super.call(this, 'error', target) || this;
            _this.message = error.message;
            _this.error = error;
            return _this;
        }
        return ErrorEvent;
    }(Event$1));
    var CloseEvent = /** @class */ (function (_super) {
        __extends$1(CloseEvent, _super);
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
                    for (let i = 0; i < tracks.length; i++) {
                        const track = tracks[i];
                        yield track.stop();
                    }
                }
                this.dispatchEvent(event);
                if (this.publishing) {
                    try {
                        yield this.unpublish();
                    }
                    catch (error) {
                        this.onError(error);
                    }
                }
                if (this.attached) {
                    try {
                        yield this.hangup();
                    }
                    catch (error) {
                        this.onError(error);
                    }
                    try {
                        yield this.detach();
                    }
                    catch (error) {
                        this.onError(error);
                    }
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
                const result = yield this.transaction(request);
                this.publishing = false;
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
                const result = yield this.transaction(request);
                this.publishing = false;
                this.attached = false;
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
            const { transaction, room_id, user_id, rtcConfiguration, mediaConstraints, logger, onError } = options;
            this.ptype = "publisher";
            this.rtcConfiguration = rtcConfiguration;
            this.mediaConstraints = mediaConstraints;
            this.id = user_id;
            this.transaction = transaction;
            this.room_id = room_id;
            this.onError = onError;
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
                const result = yield this.transaction(request);
                this.attached = false;
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
                        onError: this.onError,
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

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    function isFunction(x) {
        return typeof x === 'function';
    }

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    var _enable_super_gross_mode_that_will_cause_bad_things = false;
    var config = {
        Promise: undefined,
        set useDeprecatedSynchronousErrorHandling(value) {
            if (value) {
                var error = /*@__PURE__*/ new Error();
                /*@__PURE__*/ console.warn('DEPRECATED! RxJS was set to use deprecated synchronous error handling behavior by code at: \n' + error.stack);
            }
            _enable_super_gross_mode_that_will_cause_bad_things = value;
        },
        get useDeprecatedSynchronousErrorHandling() {
            return _enable_super_gross_mode_that_will_cause_bad_things;
        },
    };

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    function hostReportError(err) {
        setTimeout(function () { throw err; }, 0);
    }

    /** PURE_IMPORTS_START _config,_util_hostReportError PURE_IMPORTS_END */
    var empty = {
        closed: true,
        next: function (value) { },
        error: function (err) {
            if (config.useDeprecatedSynchronousErrorHandling) {
                throw err;
            }
            else {
                hostReportError(err);
            }
        },
        complete: function () { }
    };

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    var isArray = /*@__PURE__*/ (function () { return Array.isArray || (function (x) { return x && typeof x.length === 'number'; }); })();

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    function isObject(x) {
        return x !== null && typeof x === 'object';
    }

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    var UnsubscriptionErrorImpl = /*@__PURE__*/ (function () {
        function UnsubscriptionErrorImpl(errors) {
            Error.call(this);
            this.message = errors ?
                errors.length + " errors occurred during unsubscription:\n" + errors.map(function (err, i) { return i + 1 + ") " + err.toString(); }).join('\n  ') : '';
            this.name = 'UnsubscriptionError';
            this.errors = errors;
            return this;
        }
        UnsubscriptionErrorImpl.prototype = /*@__PURE__*/ Object.create(Error.prototype);
        return UnsubscriptionErrorImpl;
    })();
    var UnsubscriptionError = UnsubscriptionErrorImpl;

    /** PURE_IMPORTS_START _util_isArray,_util_isObject,_util_isFunction,_util_UnsubscriptionError PURE_IMPORTS_END */
    var Subscription = /*@__PURE__*/ (function () {
        function Subscription(unsubscribe) {
            this.closed = false;
            this._parentOrParents = null;
            this._subscriptions = null;
            if (unsubscribe) {
                this._ctorUnsubscribe = true;
                this._unsubscribe = unsubscribe;
            }
        }
        Subscription.prototype.unsubscribe = function () {
            var errors;
            if (this.closed) {
                return;
            }
            var _a = this, _parentOrParents = _a._parentOrParents, _ctorUnsubscribe = _a._ctorUnsubscribe, _unsubscribe = _a._unsubscribe, _subscriptions = _a._subscriptions;
            this.closed = true;
            this._parentOrParents = null;
            this._subscriptions = null;
            if (_parentOrParents instanceof Subscription) {
                _parentOrParents.remove(this);
            }
            else if (_parentOrParents !== null) {
                for (var index = 0; index < _parentOrParents.length; ++index) {
                    var parent_1 = _parentOrParents[index];
                    parent_1.remove(this);
                }
            }
            if (isFunction(_unsubscribe)) {
                if (_ctorUnsubscribe) {
                    this._unsubscribe = undefined;
                }
                try {
                    _unsubscribe.call(this);
                }
                catch (e) {
                    errors = e instanceof UnsubscriptionError ? flattenUnsubscriptionErrors(e.errors) : [e];
                }
            }
            if (isArray(_subscriptions)) {
                var index = -1;
                var len = _subscriptions.length;
                while (++index < len) {
                    var sub = _subscriptions[index];
                    if (isObject(sub)) {
                        try {
                            sub.unsubscribe();
                        }
                        catch (e) {
                            errors = errors || [];
                            if (e instanceof UnsubscriptionError) {
                                errors = errors.concat(flattenUnsubscriptionErrors(e.errors));
                            }
                            else {
                                errors.push(e);
                            }
                        }
                    }
                }
            }
            if (errors) {
                throw new UnsubscriptionError(errors);
            }
        };
        Subscription.prototype.add = function (teardown) {
            var subscription = teardown;
            if (!teardown) {
                return Subscription.EMPTY;
            }
            switch (typeof teardown) {
                case 'function':
                    subscription = new Subscription(teardown);
                case 'object':
                    if (subscription === this || subscription.closed || typeof subscription.unsubscribe !== 'function') {
                        return subscription;
                    }
                    else if (this.closed) {
                        subscription.unsubscribe();
                        return subscription;
                    }
                    else if (!(subscription instanceof Subscription)) {
                        var tmp = subscription;
                        subscription = new Subscription();
                        subscription._subscriptions = [tmp];
                    }
                    break;
                default: {
                    throw new Error('unrecognized teardown ' + teardown + ' added to Subscription.');
                }
            }
            var _parentOrParents = subscription._parentOrParents;
            if (_parentOrParents === null) {
                subscription._parentOrParents = this;
            }
            else if (_parentOrParents instanceof Subscription) {
                if (_parentOrParents === this) {
                    return subscription;
                }
                subscription._parentOrParents = [_parentOrParents, this];
            }
            else if (_parentOrParents.indexOf(this) === -1) {
                _parentOrParents.push(this);
            }
            else {
                return subscription;
            }
            var subscriptions = this._subscriptions;
            if (subscriptions === null) {
                this._subscriptions = [subscription];
            }
            else {
                subscriptions.push(subscription);
            }
            return subscription;
        };
        Subscription.prototype.remove = function (subscription) {
            var subscriptions = this._subscriptions;
            if (subscriptions) {
                var subscriptionIndex = subscriptions.indexOf(subscription);
                if (subscriptionIndex !== -1) {
                    subscriptions.splice(subscriptionIndex, 1);
                }
            }
        };
        Subscription.EMPTY = (function (empty) {
            empty.closed = true;
            return empty;
        }(new Subscription()));
        return Subscription;
    }());
    function flattenUnsubscriptionErrors(errors) {
        return errors.reduce(function (errs, err) { return errs.concat((err instanceof UnsubscriptionError) ? err.errors : err); }, []);
    }

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    var rxSubscriber = /*@__PURE__*/ (function () {
        return typeof Symbol === 'function'
            ? /*@__PURE__*/ Symbol('rxSubscriber')
            : '@@rxSubscriber_' + /*@__PURE__*/ Math.random();
    })();

    /** PURE_IMPORTS_START tslib,_util_isFunction,_Observer,_Subscription,_internal_symbol_rxSubscriber,_config,_util_hostReportError PURE_IMPORTS_END */
    var Subscriber = /*@__PURE__*/ (function (_super) {
        __extends(Subscriber, _super);
        function Subscriber(destinationOrNext, error, complete) {
            var _this = _super.call(this) || this;
            _this.syncErrorValue = null;
            _this.syncErrorThrown = false;
            _this.syncErrorThrowable = false;
            _this.isStopped = false;
            switch (arguments.length) {
                case 0:
                    _this.destination = empty;
                    break;
                case 1:
                    if (!destinationOrNext) {
                        _this.destination = empty;
                        break;
                    }
                    if (typeof destinationOrNext === 'object') {
                        if (destinationOrNext instanceof Subscriber) {
                            _this.syncErrorThrowable = destinationOrNext.syncErrorThrowable;
                            _this.destination = destinationOrNext;
                            destinationOrNext.add(_this);
                        }
                        else {
                            _this.syncErrorThrowable = true;
                            _this.destination = new SafeSubscriber(_this, destinationOrNext);
                        }
                        break;
                    }
                default:
                    _this.syncErrorThrowable = true;
                    _this.destination = new SafeSubscriber(_this, destinationOrNext, error, complete);
                    break;
            }
            return _this;
        }
        Subscriber.prototype[rxSubscriber] = function () { return this; };
        Subscriber.create = function (next, error, complete) {
            var subscriber = new Subscriber(next, error, complete);
            subscriber.syncErrorThrowable = false;
            return subscriber;
        };
        Subscriber.prototype.next = function (value) {
            if (!this.isStopped) {
                this._next(value);
            }
        };
        Subscriber.prototype.error = function (err) {
            if (!this.isStopped) {
                this.isStopped = true;
                this._error(err);
            }
        };
        Subscriber.prototype.complete = function () {
            if (!this.isStopped) {
                this.isStopped = true;
                this._complete();
            }
        };
        Subscriber.prototype.unsubscribe = function () {
            if (this.closed) {
                return;
            }
            this.isStopped = true;
            _super.prototype.unsubscribe.call(this);
        };
        Subscriber.prototype._next = function (value) {
            this.destination.next(value);
        };
        Subscriber.prototype._error = function (err) {
            this.destination.error(err);
            this.unsubscribe();
        };
        Subscriber.prototype._complete = function () {
            this.destination.complete();
            this.unsubscribe();
        };
        Subscriber.prototype._unsubscribeAndRecycle = function () {
            var _parentOrParents = this._parentOrParents;
            this._parentOrParents = null;
            this.unsubscribe();
            this.closed = false;
            this.isStopped = false;
            this._parentOrParents = _parentOrParents;
            return this;
        };
        return Subscriber;
    }(Subscription));
    var SafeSubscriber = /*@__PURE__*/ (function (_super) {
        __extends(SafeSubscriber, _super);
        function SafeSubscriber(_parentSubscriber, observerOrNext, error, complete) {
            var _this = _super.call(this) || this;
            _this._parentSubscriber = _parentSubscriber;
            var next;
            var context = _this;
            if (isFunction(observerOrNext)) {
                next = observerOrNext;
            }
            else if (observerOrNext) {
                next = observerOrNext.next;
                error = observerOrNext.error;
                complete = observerOrNext.complete;
                if (observerOrNext !== empty) {
                    context = Object.create(observerOrNext);
                    if (isFunction(context.unsubscribe)) {
                        _this.add(context.unsubscribe.bind(context));
                    }
                    context.unsubscribe = _this.unsubscribe.bind(_this);
                }
            }
            _this._context = context;
            _this._next = next;
            _this._error = error;
            _this._complete = complete;
            return _this;
        }
        SafeSubscriber.prototype.next = function (value) {
            if (!this.isStopped && this._next) {
                var _parentSubscriber = this._parentSubscriber;
                if (!config.useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
                    this.__tryOrUnsub(this._next, value);
                }
                else if (this.__tryOrSetError(_parentSubscriber, this._next, value)) {
                    this.unsubscribe();
                }
            }
        };
        SafeSubscriber.prototype.error = function (err) {
            if (!this.isStopped) {
                var _parentSubscriber = this._parentSubscriber;
                var useDeprecatedSynchronousErrorHandling = config.useDeprecatedSynchronousErrorHandling;
                if (this._error) {
                    if (!useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
                        this.__tryOrUnsub(this._error, err);
                        this.unsubscribe();
                    }
                    else {
                        this.__tryOrSetError(_parentSubscriber, this._error, err);
                        this.unsubscribe();
                    }
                }
                else if (!_parentSubscriber.syncErrorThrowable) {
                    this.unsubscribe();
                    if (useDeprecatedSynchronousErrorHandling) {
                        throw err;
                    }
                    hostReportError(err);
                }
                else {
                    if (useDeprecatedSynchronousErrorHandling) {
                        _parentSubscriber.syncErrorValue = err;
                        _parentSubscriber.syncErrorThrown = true;
                    }
                    else {
                        hostReportError(err);
                    }
                    this.unsubscribe();
                }
            }
        };
        SafeSubscriber.prototype.complete = function () {
            var _this = this;
            if (!this.isStopped) {
                var _parentSubscriber = this._parentSubscriber;
                if (this._complete) {
                    var wrappedComplete = function () { return _this._complete.call(_this._context); };
                    if (!config.useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
                        this.__tryOrUnsub(wrappedComplete);
                        this.unsubscribe();
                    }
                    else {
                        this.__tryOrSetError(_parentSubscriber, wrappedComplete);
                        this.unsubscribe();
                    }
                }
                else {
                    this.unsubscribe();
                }
            }
        };
        SafeSubscriber.prototype.__tryOrUnsub = function (fn, value) {
            try {
                fn.call(this._context, value);
            }
            catch (err) {
                this.unsubscribe();
                if (config.useDeprecatedSynchronousErrorHandling) {
                    throw err;
                }
                else {
                    hostReportError(err);
                }
            }
        };
        SafeSubscriber.prototype.__tryOrSetError = function (parent, fn, value) {
            if (!config.useDeprecatedSynchronousErrorHandling) {
                throw new Error('bad call');
            }
            try {
                fn.call(this._context, value);
            }
            catch (err) {
                if (config.useDeprecatedSynchronousErrorHandling) {
                    parent.syncErrorValue = err;
                    parent.syncErrorThrown = true;
                    return true;
                }
                else {
                    hostReportError(err);
                    return true;
                }
            }
            return false;
        };
        SafeSubscriber.prototype._unsubscribe = function () {
            var _parentSubscriber = this._parentSubscriber;
            this._context = null;
            this._parentSubscriber = null;
            _parentSubscriber.unsubscribe();
        };
        return SafeSubscriber;
    }(Subscriber));

    /** PURE_IMPORTS_START _Subscriber PURE_IMPORTS_END */
    function canReportError(observer) {
        while (observer) {
            var _a = observer, closed_1 = _a.closed, destination = _a.destination, isStopped = _a.isStopped;
            if (closed_1 || isStopped) {
                return false;
            }
            else if (destination && destination instanceof Subscriber) {
                observer = destination;
            }
            else {
                observer = null;
            }
        }
        return true;
    }

    /** PURE_IMPORTS_START _Subscriber,_symbol_rxSubscriber,_Observer PURE_IMPORTS_END */
    function toSubscriber(nextOrObserver, error, complete) {
        if (nextOrObserver) {
            if (nextOrObserver instanceof Subscriber) {
                return nextOrObserver;
            }
            if (nextOrObserver[rxSubscriber]) {
                return nextOrObserver[rxSubscriber]();
            }
        }
        if (!nextOrObserver && !error && !complete) {
            return new Subscriber(empty);
        }
        return new Subscriber(nextOrObserver, error, complete);
    }

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    var observable = /*@__PURE__*/ (function () { return typeof Symbol === 'function' && Symbol.observable || '@@observable'; })();

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    function identity(x) {
        return x;
    }

    /** PURE_IMPORTS_START _identity PURE_IMPORTS_END */
    function pipeFromArray(fns) {
        if (fns.length === 0) {
            return identity;
        }
        if (fns.length === 1) {
            return fns[0];
        }
        return function piped(input) {
            return fns.reduce(function (prev, fn) { return fn(prev); }, input);
        };
    }

    /** PURE_IMPORTS_START _util_canReportError,_util_toSubscriber,_symbol_observable,_util_pipe,_config PURE_IMPORTS_END */
    var Observable = /*@__PURE__*/ (function () {
        function Observable(subscribe) {
            this._isScalar = false;
            if (subscribe) {
                this._subscribe = subscribe;
            }
        }
        Observable.prototype.lift = function (operator) {
            var observable = new Observable();
            observable.source = this;
            observable.operator = operator;
            return observable;
        };
        Observable.prototype.subscribe = function (observerOrNext, error, complete) {
            var operator = this.operator;
            var sink = toSubscriber(observerOrNext, error, complete);
            if (operator) {
                sink.add(operator.call(sink, this.source));
            }
            else {
                sink.add(this.source || (config.useDeprecatedSynchronousErrorHandling && !sink.syncErrorThrowable) ?
                    this._subscribe(sink) :
                    this._trySubscribe(sink));
            }
            if (config.useDeprecatedSynchronousErrorHandling) {
                if (sink.syncErrorThrowable) {
                    sink.syncErrorThrowable = false;
                    if (sink.syncErrorThrown) {
                        throw sink.syncErrorValue;
                    }
                }
            }
            return sink;
        };
        Observable.prototype._trySubscribe = function (sink) {
            try {
                return this._subscribe(sink);
            }
            catch (err) {
                if (config.useDeprecatedSynchronousErrorHandling) {
                    sink.syncErrorThrown = true;
                    sink.syncErrorValue = err;
                }
                if (canReportError(sink)) {
                    sink.error(err);
                }
                else {
                    console.warn(err);
                }
            }
        };
        Observable.prototype.forEach = function (next, promiseCtor) {
            var _this = this;
            promiseCtor = getPromiseCtor(promiseCtor);
            return new promiseCtor(function (resolve, reject) {
                var subscription;
                subscription = _this.subscribe(function (value) {
                    try {
                        next(value);
                    }
                    catch (err) {
                        reject(err);
                        if (subscription) {
                            subscription.unsubscribe();
                        }
                    }
                }, reject, resolve);
            });
        };
        Observable.prototype._subscribe = function (subscriber) {
            var source = this.source;
            return source && source.subscribe(subscriber);
        };
        Observable.prototype[observable] = function () {
            return this;
        };
        Observable.prototype.pipe = function () {
            var operations = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                operations[_i] = arguments[_i];
            }
            if (operations.length === 0) {
                return this;
            }
            return pipeFromArray(operations)(this);
        };
        Observable.prototype.toPromise = function (promiseCtor) {
            var _this = this;
            promiseCtor = getPromiseCtor(promiseCtor);
            return new promiseCtor(function (resolve, reject) {
                var value;
                _this.subscribe(function (x) { return value = x; }, function (err) { return reject(err); }, function () { return resolve(value); });
            });
        };
        Observable.create = function (subscribe) {
            return new Observable(subscribe);
        };
        return Observable;
    }());
    function getPromiseCtor(promiseCtor) {
        if (!promiseCtor) {
            promiseCtor =  Promise;
        }
        if (!promiseCtor) {
            throw new Error('no Promise impl found');
        }
        return promiseCtor;
    }

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    var ObjectUnsubscribedErrorImpl = /*@__PURE__*/ (function () {
        function ObjectUnsubscribedErrorImpl() {
            Error.call(this);
            this.message = 'object unsubscribed';
            this.name = 'ObjectUnsubscribedError';
            return this;
        }
        ObjectUnsubscribedErrorImpl.prototype = /*@__PURE__*/ Object.create(Error.prototype);
        return ObjectUnsubscribedErrorImpl;
    })();
    var ObjectUnsubscribedError = ObjectUnsubscribedErrorImpl;

    /** PURE_IMPORTS_START tslib,_Subscription PURE_IMPORTS_END */
    var SubjectSubscription = /*@__PURE__*/ (function (_super) {
        __extends(SubjectSubscription, _super);
        function SubjectSubscription(subject, subscriber) {
            var _this = _super.call(this) || this;
            _this.subject = subject;
            _this.subscriber = subscriber;
            _this.closed = false;
            return _this;
        }
        SubjectSubscription.prototype.unsubscribe = function () {
            if (this.closed) {
                return;
            }
            this.closed = true;
            var subject = this.subject;
            var observers = subject.observers;
            this.subject = null;
            if (!observers || observers.length === 0 || subject.isStopped || subject.closed) {
                return;
            }
            var subscriberIndex = observers.indexOf(this.subscriber);
            if (subscriberIndex !== -1) {
                observers.splice(subscriberIndex, 1);
            }
        };
        return SubjectSubscription;
    }(Subscription));

    /** PURE_IMPORTS_START tslib,_Observable,_Subscriber,_Subscription,_util_ObjectUnsubscribedError,_SubjectSubscription,_internal_symbol_rxSubscriber PURE_IMPORTS_END */
    var SubjectSubscriber = /*@__PURE__*/ (function (_super) {
        __extends(SubjectSubscriber, _super);
        function SubjectSubscriber(destination) {
            var _this = _super.call(this, destination) || this;
            _this.destination = destination;
            return _this;
        }
        return SubjectSubscriber;
    }(Subscriber));
    var Subject = /*@__PURE__*/ (function (_super) {
        __extends(Subject, _super);
        function Subject() {
            var _this = _super.call(this) || this;
            _this.observers = [];
            _this.closed = false;
            _this.isStopped = false;
            _this.hasError = false;
            _this.thrownError = null;
            return _this;
        }
        Subject.prototype[rxSubscriber] = function () {
            return new SubjectSubscriber(this);
        };
        Subject.prototype.lift = function (operator) {
            var subject = new AnonymousSubject(this, this);
            subject.operator = operator;
            return subject;
        };
        Subject.prototype.next = function (value) {
            if (this.closed) {
                throw new ObjectUnsubscribedError();
            }
            if (!this.isStopped) {
                var observers = this.observers;
                var len = observers.length;
                var copy = observers.slice();
                for (var i = 0; i < len; i++) {
                    copy[i].next(value);
                }
            }
        };
        Subject.prototype.error = function (err) {
            if (this.closed) {
                throw new ObjectUnsubscribedError();
            }
            this.hasError = true;
            this.thrownError = err;
            this.isStopped = true;
            var observers = this.observers;
            var len = observers.length;
            var copy = observers.slice();
            for (var i = 0; i < len; i++) {
                copy[i].error(err);
            }
            this.observers.length = 0;
        };
        Subject.prototype.complete = function () {
            if (this.closed) {
                throw new ObjectUnsubscribedError();
            }
            this.isStopped = true;
            var observers = this.observers;
            var len = observers.length;
            var copy = observers.slice();
            for (var i = 0; i < len; i++) {
                copy[i].complete();
            }
            this.observers.length = 0;
        };
        Subject.prototype.unsubscribe = function () {
            this.isStopped = true;
            this.closed = true;
            this.observers = null;
        };
        Subject.prototype._trySubscribe = function (subscriber) {
            if (this.closed) {
                throw new ObjectUnsubscribedError();
            }
            else {
                return _super.prototype._trySubscribe.call(this, subscriber);
            }
        };
        Subject.prototype._subscribe = function (subscriber) {
            if (this.closed) {
                throw new ObjectUnsubscribedError();
            }
            else if (this.hasError) {
                subscriber.error(this.thrownError);
                return Subscription.EMPTY;
            }
            else if (this.isStopped) {
                subscriber.complete();
                return Subscription.EMPTY;
            }
            else {
                this.observers.push(subscriber);
                return new SubjectSubscription(this, subscriber);
            }
        };
        Subject.prototype.asObservable = function () {
            var observable = new Observable();
            observable.source = this;
            return observable;
        };
        Subject.create = function (destination, source) {
            return new AnonymousSubject(destination, source);
        };
        return Subject;
    }(Observable));
    var AnonymousSubject = /*@__PURE__*/ (function (_super) {
        __extends(AnonymousSubject, _super);
        function AnonymousSubject(destination, source) {
            var _this = _super.call(this) || this;
            _this.destination = destination;
            _this.source = source;
            return _this;
        }
        AnonymousSubject.prototype.next = function (value) {
            var destination = this.destination;
            if (destination && destination.next) {
                destination.next(value);
            }
        };
        AnonymousSubject.prototype.error = function (err) {
            var destination = this.destination;
            if (destination && destination.error) {
                this.destination.error(err);
            }
        };
        AnonymousSubject.prototype.complete = function () {
            var destination = this.destination;
            if (destination && destination.complete) {
                this.destination.complete();
            }
        };
        AnonymousSubject.prototype._subscribe = function (subscriber) {
            var source = this.source;
            if (source) {
                return this.source.subscribe(subscriber);
            }
            else {
                return Subscription.EMPTY;
            }
        };
        return AnonymousSubject;
    }(Subject));

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    var subscribeToArray = function (array) {
        return function (subscriber) {
            for (var i = 0, len = array.length; i < len && !subscriber.closed; i++) {
                subscriber.next(array[i]);
            }
            subscriber.complete();
        };
    };

    /** PURE_IMPORTS_START _Observable,_Subscription PURE_IMPORTS_END */
    function scheduleArray(input, scheduler) {
        return new Observable(function (subscriber) {
            var sub = new Subscription();
            var i = 0;
            sub.add(scheduler.schedule(function () {
                if (i === input.length) {
                    subscriber.complete();
                    return;
                }
                subscriber.next(input[i++]);
                if (!subscriber.closed) {
                    sub.add(this.schedule());
                }
            }));
            return sub;
        });
    }

    /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
    function map(project, thisArg) {
        return function mapOperation(source) {
            if (typeof project !== 'function') {
                throw new TypeError('argument is not a function. Are you looking for `mapTo()`?');
            }
            return source.lift(new MapOperator(project, thisArg));
        };
    }
    var MapOperator = /*@__PURE__*/ (function () {
        function MapOperator(project, thisArg) {
            this.project = project;
            this.thisArg = thisArg;
        }
        MapOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new MapSubscriber(subscriber, this.project, this.thisArg));
        };
        return MapOperator;
    }());
    var MapSubscriber = /*@__PURE__*/ (function (_super) {
        __extends(MapSubscriber, _super);
        function MapSubscriber(destination, project, thisArg) {
            var _this = _super.call(this, destination) || this;
            _this.project = project;
            _this.count = 0;
            _this.thisArg = thisArg || _this;
            return _this;
        }
        MapSubscriber.prototype._next = function (value) {
            var result;
            try {
                result = this.project.call(this.thisArg, value, this.count++);
            }
            catch (err) {
                this.destination.error(err);
                return;
            }
            this.destination.next(result);
        };
        return MapSubscriber;
    }(Subscriber));

    /** PURE_IMPORTS_START _hostReportError PURE_IMPORTS_END */
    var subscribeToPromise = function (promise) {
        return function (subscriber) {
            promise.then(function (value) {
                if (!subscriber.closed) {
                    subscriber.next(value);
                    subscriber.complete();
                }
            }, function (err) { return subscriber.error(err); })
                .then(null, hostReportError);
            return subscriber;
        };
    };

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    function getSymbolIterator() {
        if (typeof Symbol !== 'function' || !Symbol.iterator) {
            return '@@iterator';
        }
        return Symbol.iterator;
    }
    var iterator = /*@__PURE__*/ getSymbolIterator();

    /** PURE_IMPORTS_START _symbol_iterator PURE_IMPORTS_END */
    var subscribeToIterable = function (iterable) {
        return function (subscriber) {
            var iterator$1 = iterable[iterator]();
            do {
                var item = void 0;
                try {
                    item = iterator$1.next();
                }
                catch (err) {
                    subscriber.error(err);
                    return subscriber;
                }
                if (item.done) {
                    subscriber.complete();
                    break;
                }
                subscriber.next(item.value);
                if (subscriber.closed) {
                    break;
                }
            } while (true);
            if (typeof iterator$1.return === 'function') {
                subscriber.add(function () {
                    if (iterator$1.return) {
                        iterator$1.return();
                    }
                });
            }
            return subscriber;
        };
    };

    /** PURE_IMPORTS_START _symbol_observable PURE_IMPORTS_END */
    var subscribeToObservable = function (obj) {
        return function (subscriber) {
            var obs = obj[observable]();
            if (typeof obs.subscribe !== 'function') {
                throw new TypeError('Provided object does not correctly implement Symbol.observable');
            }
            else {
                return obs.subscribe(subscriber);
            }
        };
    };

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    var isArrayLike = (function (x) { return x && typeof x.length === 'number' && typeof x !== 'function'; });

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    function isPromise(value) {
        return !!value && typeof value.subscribe !== 'function' && typeof value.then === 'function';
    }

    /** PURE_IMPORTS_START _subscribeToArray,_subscribeToPromise,_subscribeToIterable,_subscribeToObservable,_isArrayLike,_isPromise,_isObject,_symbol_iterator,_symbol_observable PURE_IMPORTS_END */
    var subscribeTo = function (result) {
        if (!!result && typeof result[observable] === 'function') {
            return subscribeToObservable(result);
        }
        else if (isArrayLike(result)) {
            return subscribeToArray(result);
        }
        else if (isPromise(result)) {
            return subscribeToPromise(result);
        }
        else if (!!result && typeof result[iterator] === 'function') {
            return subscribeToIterable(result);
        }
        else {
            var value = isObject(result) ? 'an invalid object' : "'" + result + "'";
            var msg = "You provided " + value + " where a stream was expected."
                + ' You can provide an Observable, Promise, Array, or Iterable.';
            throw new TypeError(msg);
        }
    };

    /** PURE_IMPORTS_START _Observable,_Subscription,_symbol_observable PURE_IMPORTS_END */
    function scheduleObservable(input, scheduler) {
        return new Observable(function (subscriber) {
            var sub = new Subscription();
            sub.add(scheduler.schedule(function () {
                var observable$1 = input[observable]();
                sub.add(observable$1.subscribe({
                    next: function (value) { sub.add(scheduler.schedule(function () { return subscriber.next(value); })); },
                    error: function (err) { sub.add(scheduler.schedule(function () { return subscriber.error(err); })); },
                    complete: function () { sub.add(scheduler.schedule(function () { return subscriber.complete(); })); },
                }));
            }));
            return sub;
        });
    }

    /** PURE_IMPORTS_START _Observable,_Subscription PURE_IMPORTS_END */
    function schedulePromise(input, scheduler) {
        return new Observable(function (subscriber) {
            var sub = new Subscription();
            sub.add(scheduler.schedule(function () {
                return input.then(function (value) {
                    sub.add(scheduler.schedule(function () {
                        subscriber.next(value);
                        sub.add(scheduler.schedule(function () { return subscriber.complete(); }));
                    }));
                }, function (err) {
                    sub.add(scheduler.schedule(function () { return subscriber.error(err); }));
                });
            }));
            return sub;
        });
    }

    /** PURE_IMPORTS_START _Observable,_Subscription,_symbol_iterator PURE_IMPORTS_END */
    function scheduleIterable(input, scheduler) {
        if (!input) {
            throw new Error('Iterable cannot be null');
        }
        return new Observable(function (subscriber) {
            var sub = new Subscription();
            var iterator$1;
            sub.add(function () {
                if (iterator$1 && typeof iterator$1.return === 'function') {
                    iterator$1.return();
                }
            });
            sub.add(scheduler.schedule(function () {
                iterator$1 = input[iterator]();
                sub.add(scheduler.schedule(function () {
                    if (subscriber.closed) {
                        return;
                    }
                    var value;
                    var done;
                    try {
                        var result = iterator$1.next();
                        value = result.value;
                        done = result.done;
                    }
                    catch (err) {
                        subscriber.error(err);
                        return;
                    }
                    if (done) {
                        subscriber.complete();
                    }
                    else {
                        subscriber.next(value);
                        this.schedule();
                    }
                }));
            }));
            return sub;
        });
    }

    /** PURE_IMPORTS_START _symbol_observable PURE_IMPORTS_END */
    function isInteropObservable(input) {
        return input && typeof input[observable] === 'function';
    }

    /** PURE_IMPORTS_START _symbol_iterator PURE_IMPORTS_END */
    function isIterable(input) {
        return input && typeof input[iterator] === 'function';
    }

    /** PURE_IMPORTS_START _scheduleObservable,_schedulePromise,_scheduleArray,_scheduleIterable,_util_isInteropObservable,_util_isPromise,_util_isArrayLike,_util_isIterable PURE_IMPORTS_END */
    function scheduled(input, scheduler) {
        if (input != null) {
            if (isInteropObservable(input)) {
                return scheduleObservable(input, scheduler);
            }
            else if (isPromise(input)) {
                return schedulePromise(input, scheduler);
            }
            else if (isArrayLike(input)) {
                return scheduleArray(input, scheduler);
            }
            else if (isIterable(input) || typeof input === 'string') {
                return scheduleIterable(input, scheduler);
            }
        }
        throw new TypeError((input !== null && typeof input || input) + ' is not observable');
    }

    /** PURE_IMPORTS_START _Observable,_util_subscribeTo,_scheduled_scheduled PURE_IMPORTS_END */
    function from(input, scheduler) {
        if (!scheduler) {
            if (input instanceof Observable) {
                return input;
            }
            return new Observable(subscribeTo(input));
        }
        else {
            return scheduled(input, scheduler);
        }
    }

    /** PURE_IMPORTS_START tslib,_Subscriber,_Observable,_util_subscribeTo PURE_IMPORTS_END */
    var SimpleInnerSubscriber = /*@__PURE__*/ (function (_super) {
        __extends(SimpleInnerSubscriber, _super);
        function SimpleInnerSubscriber(parent) {
            var _this = _super.call(this) || this;
            _this.parent = parent;
            return _this;
        }
        SimpleInnerSubscriber.prototype._next = function (value) {
            this.parent.notifyNext(value);
        };
        SimpleInnerSubscriber.prototype._error = function (error) {
            this.parent.notifyError(error);
            this.unsubscribe();
        };
        SimpleInnerSubscriber.prototype._complete = function () {
            this.parent.notifyComplete();
            this.unsubscribe();
        };
        return SimpleInnerSubscriber;
    }(Subscriber));
    var SimpleOuterSubscriber = /*@__PURE__*/ (function (_super) {
        __extends(SimpleOuterSubscriber, _super);
        function SimpleOuterSubscriber() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SimpleOuterSubscriber.prototype.notifyNext = function (innerValue) {
            this.destination.next(innerValue);
        };
        SimpleOuterSubscriber.prototype.notifyError = function (err) {
            this.destination.error(err);
        };
        SimpleOuterSubscriber.prototype.notifyComplete = function () {
            this.destination.complete();
        };
        return SimpleOuterSubscriber;
    }(Subscriber));
    function innerSubscribe(result, innerSubscriber) {
        if (innerSubscriber.closed) {
            return undefined;
        }
        if (result instanceof Observable) {
            return result.subscribe(innerSubscriber);
        }
        return subscribeTo(result)(innerSubscriber);
    }

    /** PURE_IMPORTS_START tslib,_map,_observable_from,_innerSubscribe PURE_IMPORTS_END */
    function mergeMap(project, resultSelector, concurrent) {
        if (concurrent === void 0) {
            concurrent = Number.POSITIVE_INFINITY;
        }
        if (typeof resultSelector === 'function') {
            return function (source) { return source.pipe(mergeMap(function (a, i) { return from(project(a, i)).pipe(map(function (b, ii) { return resultSelector(a, b, i, ii); })); }, concurrent)); };
        }
        else if (typeof resultSelector === 'number') {
            concurrent = resultSelector;
        }
        return function (source) { return source.lift(new MergeMapOperator(project, concurrent)); };
    }
    var MergeMapOperator = /*@__PURE__*/ (function () {
        function MergeMapOperator(project, concurrent) {
            if (concurrent === void 0) {
                concurrent = Number.POSITIVE_INFINITY;
            }
            this.project = project;
            this.concurrent = concurrent;
        }
        MergeMapOperator.prototype.call = function (observer, source) {
            return source.subscribe(new MergeMapSubscriber(observer, this.project, this.concurrent));
        };
        return MergeMapOperator;
    }());
    var MergeMapSubscriber = /*@__PURE__*/ (function (_super) {
        __extends(MergeMapSubscriber, _super);
        function MergeMapSubscriber(destination, project, concurrent) {
            if (concurrent === void 0) {
                concurrent = Number.POSITIVE_INFINITY;
            }
            var _this = _super.call(this, destination) || this;
            _this.project = project;
            _this.concurrent = concurrent;
            _this.hasCompleted = false;
            _this.buffer = [];
            _this.active = 0;
            _this.index = 0;
            return _this;
        }
        MergeMapSubscriber.prototype._next = function (value) {
            if (this.active < this.concurrent) {
                this._tryNext(value);
            }
            else {
                this.buffer.push(value);
            }
        };
        MergeMapSubscriber.prototype._tryNext = function (value) {
            var result;
            var index = this.index++;
            try {
                result = this.project(value, index);
            }
            catch (err) {
                this.destination.error(err);
                return;
            }
            this.active++;
            this._innerSub(result);
        };
        MergeMapSubscriber.prototype._innerSub = function (ish) {
            var innerSubscriber = new SimpleInnerSubscriber(this);
            var destination = this.destination;
            destination.add(innerSubscriber);
            var innerSubscription = innerSubscribe(ish, innerSubscriber);
            if (innerSubscription !== innerSubscriber) {
                destination.add(innerSubscription);
            }
        };
        MergeMapSubscriber.prototype._complete = function () {
            this.hasCompleted = true;
            if (this.active === 0 && this.buffer.length === 0) {
                this.destination.complete();
            }
            this.unsubscribe();
        };
        MergeMapSubscriber.prototype.notifyNext = function (innerValue) {
            this.destination.next(innerValue);
        };
        MergeMapSubscriber.prototype.notifyComplete = function () {
            var buffer = this.buffer;
            this.active--;
            if (buffer.length > 0) {
                this._next(buffer.shift());
            }
            else if (this.active === 0 && this.hasCompleted) {
                this.destination.complete();
            }
        };
        return MergeMapSubscriber;
    }(SimpleOuterSubscriber));

    /** PURE_IMPORTS_START _mergeMap PURE_IMPORTS_END */
    function concatMap(project, resultSelector) {
        return mergeMap(project, resultSelector, 1);
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
            return React.createElement("video", { id: `video-${id}`, muted: muted, style: style, ref: (video) => { this.video = video; } });
        }
    }
    class JanusVideoRoom extends React.Component {
        constructor(props) {
            super(props);
            this.cleanup = () => {
                if (this.s) {
                    this.s.unsubscribe();
                    this.s = undefined;
                }
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
                if (!this.props.cameraId ||
                    !this.client ||
                    !this.client.publisher ||
                    !this.client.publisher.pc ||
                    !this.client.publisher.stream) {
                    return;
                }
                try {
                    yield this.client.replaceVideoTrack(this.props.cameraId);
                }
                catch (error) {
                    this.props.onError(error);
                }
                this.forceUpdate();
            });
            this.onChangeRoom = (prevRoom) => __awaiter(this, void 0, void 0, function* () {
                const { mediaConstraints, onError } = this.props;
                const leave = prevRoom && !this.props.room;
                const join = !prevRoom && this.props.room;
                const change = prevRoom && this.props.room && prevRoom !== this.props.room;
                let constraints = null;
                if (this.props.cameraId) {
                    constraints = {
                        video: {
                            deviceId: {
                                exact: this.props.cameraId
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
                return (React.createElement("div", { style: this.state.styles.container }, content));
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
            this.tasks = new Subject();
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
            this.s = this.tasks
                .pipe(concatMap(({ type, load }) => {
                if (type === "room") {
                    return from(this.onChangeRoom(load));
                }
                else if (type === "camera") {
                    return from(this.onChangeCamera());
                }
            }))
                .subscribe(() => {
            });
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
                this.tasks.next({
                    type: "room",
                    load: prevProps.room
                });
            }
            if (prevProps.cameraId !== this.props.cameraId) {
                this.tasks.next({
                    type: "camera"
                });
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

    Object.defineProperty(exports, '__esModule', { value: true });

})));
