import * as canva from "./canva";
import * as websocket from "./websocket";
const color="rgb(100,100,100)";
const userName="LPC";
const timeInterval = 10;
const canvaWidth=800;
const canvaHeight=400;
const body = document.body;
var renderer = document.createElement("canvas") as HTMLCanvasElement;
var placeholder=document.getElementById("placeholder");
var interval = 0;
var mouseX = 0, mouseY = 0,oldMouseX=0,oldMouseY=0;
var pressed=0,entered=0;
var webSocketInstance=websocket.initalizeWebSocket();



//update whenever mouse moves
function updateMouse(e:MouseEvent){
    mouseX = e.clientX-renderer.getBoundingClientRect().x;
    mouseY = e.clientY-renderer.getBoundingClientRect().y;
}
//update by taking the previous interval's mouse coord
function updateOldMouse(){
    oldMouseX=mouseX;
    oldMouseY=mouseY;
}

//executed when a left click is holded, paint and send paint operation if entered canva
function holdOperation(){
    console.log(mouseX);
    console.log(mouseY);
    if ((renderer)&&(entered)){
        //canva.paintCanva(mouseX,mouseY,oldMouseX,oldMouseY,color,renderer);
        canva.paintRequest(mouseX,mouseY,oldMouseX,oldMouseY,color,userName,webSocketInstance);//program stuck in this line, so need updateoldmouse before it
        updateOldMouse();
    }
    else updateOldMouse();
}

//executed when a left click is pressed
function pressOperation(e:MouseEvent) {
    console.log("DOWN");
    updateOldMouse();
    clearInterval(interval);
    interval = setInterval(function () {
        holdOperation();
    }, timeInterval);
    console.log("interval: "+interval);
}

function bindEvent(){
    body.addEventListener("mousemove",  (e)=>{
        updateMouse(e);
    });
    body.addEventListener("mousedown", (e)=>{
        pressOperation(e);
    });
    body.addEventListener("mouseup",  (e)=>{
        console.log("UP "+interval);
        clearInterval(interval);
    });
    renderer.addEventListener("mouseleave",  (e)=>{
        entered=0;
    });
    renderer.addEventListener("mouseenter",(e)=>{
        updateOldMouse();
        entered=1;
    })
}
    
    function updateRenderer(){
        console.log("renderer is: "+renderer.innerHTML);
        placeholder.replaceWith(renderer);
        bindEvent();
    }

    webSocketInstance.onopen=()=>{
        console.log("updateRenderer");
        renderer=canva.generateNewCanva(canvaWidth,canvaHeight);
        canva.initalizeServerCanva(webSocketInstance,renderer);
        canva.getCanva(webSocketInstance);
        updateRenderer();
    }

    webSocketInstance.onmessage=(event:MessageEvent)=>{
        const message=event.data as string;
        console.log("received message: "+message);
        if (message!=""){
            if (message.slice(0,3)=="set"){
                console.log("set received!");
                
                
                
                updateRenderer();
            }
            if (message.slice(0,5)=="paint"){
                console.log("paint received!"+message.substring(6));
                canva.remotePaintCanva(message.substring(6),renderer);
            }
        }
    }
   
    
