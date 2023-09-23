package com.passthemessserver.app;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.InetSocketAddress;
import java.net.UnknownHostException;

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

    @Override
    public void onOpen(WebSocket conn, ClientHandshake handshake) {
        System.out.println("yo welcome");
        conn.send("Welcome to the server!"); // This method sends a message to the new client
        broadcast("new connection: " + handshake
                .getResourceDescriptor()); // This method sends a message to all clients connected
        System.out.println(
                conn.getRemoteSocketAddress().getAddress().getHostAddress() + " entered the room!");
    }

    @Override
    public void onClose(WebSocket conn, int code, String reason, boolean remote) {
        broadcast(conn + " has left the room!");
        System.out.println(conn + " has left the room!");
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
        }
        if (message.startsWith("initalize")){
            System.out.println("Initalize request received");
            if (canva.getCanva()=="") canva.setCanva("set "+message.substring(10));
        }
        if (message.startsWith("get")){
            System.out.println("Get request received");
            System.out.println("message is "+message);
            System.out.println("canva is "+canva.getCanva());
            conn.send(canva.getCanva());
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