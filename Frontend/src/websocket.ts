function connectWebSocket(){
    var webSocket = new WebSocket("ws://192.168.0.159:8887");
    return webSocket;
}
function initalizeWebSocket(){
    var webSocketInstance=connectWebSocket();
    webSocketInstance.onopen=()=>{}
    webSocketInstance.onmessage=(event:MessageEvent)=>{
        console.log("received: "+event.data);
    }
    return webSocketInstance;
}
export {connectWebSocket,initalizeWebSocket}