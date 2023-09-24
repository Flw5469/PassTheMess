package com.passthemessserver.app;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.InetSocketAddress;
import java.net.UnknownHostException;
import java.util.HashSet;
import java.util.Set;

import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;

public class CustomSocket extends WebSocketServer {

    public CustomSocket(int port) throws UnknownHostException {
        super(new InetSocketAddress(port));
        canva=new Canva("");
      }
    
      public CustomSocket(InetSocketAddress address) {
        super(address);
        canva=new Canva("");
      }

      public Canva canva;
      public Set<WebSocket> userSet = new HashSet<>();
      public Set<WebSocket> callBackUserSet= new HashSet<>();
      public WebSocket host=null;
    
    /*
    @Override
    public void onOpen(WebSocket conn, ClientHandshake handshake) {
        System.out.println("yo welcome");
        conn.send("Welcome to the server!"); // This method sends a message to the new client
        broadcast("new connection: " + handshake
                .getResourceDescriptor()); // This method sends a message to all clients connected
        System.out.println(
                conn.getRemoteSocketAddress().getAddress().getHostAddress() + " entered the room!");
    }
    */

    public void onOpen(WebSocket conn, ClientHandshake handshake) {
        conn.send("Welcome to the server!"); // This method sends a message to the new client
        broadcast("new connection: " + handshake
                .getResourceDescriptor()); // This method sends a message to all clients connected
        System.out.println(
                conn.getRemoteSocketAddress().getAddress().getHostAddress() + " entered the room!");

        userSet.add(conn);
        if (host==null) host=conn;
    }
    @Override
    public void onClose(WebSocket conn, int code, String reason, boolean remote) {
        broadcast(conn + " has left the room!");
        System.out.println(conn + " has left the room!");
        userSet.remove(conn);
        if (userSet.isEmpty()) canva.clearCanva();
        if (!userSet.isEmpty()){
            host=userSet.iterator().next();
        }
    }

    @Override
    public void onMessage(WebSocket conn, String message) {
        System.out.println(message);
        if (message.startsWith("paint")){
            System.out.println("Paint received");
            broadcast(message);
        }
        if (message.startsWith("set")){
            System.out.println("Set request received");
            canva.setCanva(message);
            System.out.println("message is "+message);
            System.out.println("canva is "+canva.getCanva());

            for (WebSocket e:callBackUserSet){
                if (e.isOpen())
                e.send(canva.getCanva());
            }
            callBackUserSet.clear();
        }
        /* 
        if (message.startsWith("initalize")){
            System.out.println("Initalize request received");
            if (canva.getCanva()=="") canva.setCanva("set "+message.substring(10));
        }
        */
        if (message.startsWith("get")){//ask host for update, put getter into reply list
            System.out.println("Get request received");
            System.out.println("message is "+message);
            System.out.println("canva is "+canva.getCanva());
            callBackUserSet.add(conn);
            if (host!=null)
                host.send("get");
        }                

    }

    @Override
    public void onError(WebSocket conn, Exception ex) {
        ex.printStackTrace();
        if (conn != null) {
            // some errors like port binding failed may not be assignable to a specific
            // websocket
        }

    }

    @Override
    public void onStart() {
        System.out.println("Server started!");
        setConnectionLostTimeout(0);
        setConnectionLostTimeout(100);

    }

}