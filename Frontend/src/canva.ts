interface paintApi{
    xCoordinate:number,
    yCoordinate:number,
    oldXCoordinate:number,
    oldYCoordinate:number,
    color:string,
    id:number,
}

//check paint request within canva
function insideCanva(){
    return true;
}
//generate new canva with parameters, called when server response no canva data
function generateNewCanva(width:number,height:number){
    var canva=document.createElement("canvas") as HTMLCanvasElement;
    canva.classList.add("render");
    canva.width=width;
    canva.height=height;
    return canva;
}

function initalizeServerCanva(websocket:WebSocket,renderer:HTMLCanvasElement){
    const message=renderer.toDataURL();
    console.log("sending "+message);
    websocket.send("initalize "+message);
}

//write to server canvas, not initalize
function setCanva(websocket:WebSocket,renderer:HTMLCanvasElement){
    const message=renderer.toDataURL();
    console.log("sending "+message);
    websocket.send("set "+message);
}
//get from server canvas, call once in initalize
function getCanva(websocket:WebSocket){
    websocket.send("get");
}

//called when server response with the newest canva, expect a html format, with prefix set.
function generateCanva(canvaText:string){
    canvaText=canvaText.substring(4);
    console.log("canvaText: "+canvaText);
    var canva=document.createElement("canvas");
    const image = new Image();
    image.src=canvaText;
    image.onload = function() {
    canva.width = image.width;
    canva.height = image.height;
    canva.getContext("2d").drawImage(image, 0, 0);
    };
    canva.classList.add("render");
    return canva;
}

//called when receive response from socket or painting in local
function paintCanva(X:number,Y:number,oldX:number,oldY:number,color:string,renderer:HTMLCanvasElement){
    if (!insideCanva) return;
    var ctx=renderer.getContext("2d");
    if (ctx){
        console.log("paint success!"+X+Y+oldX+oldY+color);
        ctx.beginPath();
        ctx.moveTo(oldX,oldY);
        ctx.lineTo(X,Y);
        ctx.strokeStyle=color;
        ctx.stroke();
    }
    else console.log("paint fail!");
}
function remotePaintCanva(paintString:string,renderer:HTMLCanvasElement){
    const paint=JSON.parse(paintString) as paintApi;
    paintCanva(paint.xCoordinate,paint.yCoordinate,paint.oldXCoordinate,paint.oldYCoordinate,paint.color,renderer);

}
//send new paint operation to server
function paintRequest(X:number,Y:number,oldX:number,oldY:number,color:string,userId:string,webSocket:WebSocket){
    if (webSocket.readyState==webSocket.OPEN){
        var paintRequestObject={
            xCoordinate:X,
            yCoordinate:Y,
            oldXCoordinate:oldX,
            oldYCoordinate:oldY,
            color:color,
            id:userId,
        }
        webSocket.send("paint "+JSON.stringify(paintRequestObject));
    }
    else console.log("NOT OPEN");
}

export {paintCanva,paintRequest,setCanva,generateCanva,generateNewCanva,initalizeServerCanva,getCanva,remotePaintCanva}