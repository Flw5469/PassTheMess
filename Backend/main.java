import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.ServerSocket;
import java.net.Socket;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Scanner;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class WebSocket {
    public static void main(String[] args) throws IOException, NoSuchAlgorithmException {
        ServerSocket server = new ServerSocket(80);
        try {
            System.out.println("Server has started on 127.0.0.1:80.\r\nWaiting for a connection…");
            Socket client = server.accept();
            System.out.println("A client connected.");
        } catch(Exception e){
            throw e;
        }
    }
}