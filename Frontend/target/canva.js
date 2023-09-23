define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.remotePaintCanva = exports.getCanva = exports.initalizeServerCanva = exports.generateNewCanva = exports.generateCanva = exports.setCanva = exports.paintRequest = exports.paintCanva = void 0;
    function insideCanva() {
        return true;
    }
    function generateNewCanva(width, height) {
        var canva = document.createElement("canvas");
        canva.classList.add("render");
        canva.width = width;
        canva.height = height;
        return canva;
    }
    exports.generateNewCanva = generateNewCanva;
    function initalizeServerCanva(websocket, renderer) {
        var message = renderer.toDataURL();
        console.log("sending " + message);
        websocket.send("initalize " + message);
    }
    exports.initalizeServerCanva = initalizeServerCanva;
    function setCanva(websocket, renderer) {
        var message = renderer.toDataURL;
        console.log("sending " + message);
        websocket.send("set " + message);
    }
    exports.setCanva = setCanva;
    function getCanva(websocket) {
        websocket.send("get");
    }
    exports.getCanva = getCanva;
    function generateCanva(canvaText) {
        canvaText = canvaText.substring(4);
        console.log("canvaText: " + canvaText);
        var canva = document.createElement("canvas");
        var image = new Image();
        image.src = canvaText;
        image.onload = function () {
            canva.width = image.width;
            canva.height = image.height;
            canva.getContext("2d").drawImage(image, 0, 0);
        };
        return canva;
    }
    exports.generateCanva = generateCanva;
    function paintCanva(X, Y, oldX, oldY, color, renderer) {
        if (!insideCanva)
            return;
        var ctx = renderer.getContext("2d");
        if (ctx) {
            console.log("paint success!" + X + Y + oldX + oldY + color);
            ctx.beginPath();
            ctx.moveTo(oldX, oldY);
            ctx.lineTo(X, Y);
            ctx.strokeStyle = color;
            ctx.stroke();
        }
        else
            console.log("paint fail!");
    }
    exports.paintCanva = paintCanva;
    function remotePaintCanva(paintString, renderer) {
        var paint = JSON.parse(paintString);
        paintCanva(paint.xCoordinate, paint.yCoordinate, paint.oldXCoordinate, paint.oldYCoordinate, paint.color, renderer);
    }
    exports.remotePaintCanva = remotePaintCanva;
    function paintRequest(X, Y, oldX, oldY, color, userId, webSocket) {
        if (webSocket.readyState == webSocket.OPEN) {
            var paintRequestObject = {
                xCoordinate: X,
                yCoordinate: Y,
                oldXCoordinate: oldX,
                oldYCoordinate: oldY,
                color: color,
                id: userId,
            };
            webSocket.send("paint " + JSON.stringify(paintRequestObject));
        }
        else
            console.log("NOT OPEN");
    }
    exports.paintRequest = paintRequest;
});
//# sourceMappingURL=canva.js.map