define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.initalizeWebSocket = exports.connectWebSocket = void 0;
    function connectWebSocket() {
        var webSocket = new WebSocket("ws://192.168.0.159:8887");
        return webSocket;
    }
    exports.connectWebSocket = connectWebSocket;
    function initalizeWebSocket() {
        var webSocketInstance = connectWebSocket();
        webSocketInstance.onopen = function () { };
        webSocketInstance.onmessage = function (event) {
            console.log("received: " + event.data);
        };
        return webSocketInstance;
    }
    exports.initalizeWebSocket = initalizeWebSocket;
});
//# sourceMappingURL=websocket.js.map