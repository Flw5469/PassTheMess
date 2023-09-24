define(["require", "exports", "./canva", "./websocket"], function (require, exports, canva, websocket) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var color = "rgb(100,100,100)";
    var userName = "LPC";
    var timeInterval = 10;
    var canvaWidth = 800;
    var canvaHeight = 400;
    var body = document.body;
    var renderer = document.createElement("canvas");
    var placeholder = document.getElementById("placeholder");
    var interval = 0;
    var mouseX = 0, mouseY = 0, oldMouseX = 0, oldMouseY = 0;
    var pressed = 0, entered = 0;
    var webSocketInstance = websocket.initalizeWebSocket();
    function updateMouse(e) {
        mouseX = e.clientX - renderer.getBoundingClientRect().x;
        mouseY = e.clientY - renderer.getBoundingClientRect().y;
    }
    function updateOldMouse() {
        oldMouseX = mouseX;
        oldMouseY = mouseY;
    }
    function holdOperation() {
        console.log(mouseX);
        console.log(mouseY);
        if ((renderer) && (entered)) {
            canva.paintRequest(mouseX, mouseY, oldMouseX, oldMouseY, color, userName, webSocketInstance);
            updateOldMouse();
        }
        else
            updateOldMouse();
    }
    function pressOperation(e) {
        console.log("DOWN");
        updateOldMouse();
        clearInterval(interval);
        interval = setInterval(function () {
            holdOperation();
        }, timeInterval);
        console.log("interval: " + interval);
    }
    function bindEvent() {
        body.addEventListener("mousemove", function (e) {
            updateMouse(e);
        });
        body.addEventListener("mousedown", function (e) {
            pressOperation(e);
        });
        body.addEventListener("mouseup", function (e) {
            console.log("UP " + interval);
            clearInterval(interval);
        });
        renderer.addEventListener("mouseleave", function (e) {
            entered = 0;
        });
        renderer.addEventListener("mouseenter", function (e) {
            updateOldMouse();
            entered = 1;
        });
    }
    function updateRenderer(temp_renderer) {
        console.log("updateRenderer");
        renderer.replaceWith(temp_renderer);
        renderer = temp_renderer;
        bindEvent();
    }
    webSocketInstance.onopen = function () {
        var temp_renderer = canva.generateNewCanva(canvaWidth, canvaHeight);
        canva.getCanva(webSocketInstance);
        placeholder.replaceWith(renderer);
        updateRenderer(temp_renderer);
    };
    webSocketInstance.onmessage = function (event) {
        var message = event.data;
        console.log("received message: " + message);
        if (message != "") {
            if (message.slice(0, 3) == "set") {
                console.log("set received!" + message);
                var temp_renderer = canva.generateCanva(message);
                updateRenderer(temp_renderer);
            }
            if (message.slice(0, 5) == "paint") {
                console.log("paint received!" + message.substring(6));
                canva.remotePaintCanva(message.substring(6), renderer);
            }
            if (message.slice(0, 3) == "get") {
                canva.setCanva(webSocketInstance, renderer);
            }
        }
    };
});
//# sourceMappingURL=index.js.map