package com.passthemessbackend.app;

import static org.junit.Assert.assertTrue;

import java.io.IOException;

import org.java_websocket.server.WebSocketServer;
import org.junit.Test;

/**
 * Unit test for simple App.
 */
public class AppTest 
{
    /**
     * Rigorous Test :-)
     */
    @Test
    public void shouldAnswerWithTrue()
    {
        assertTrue( true );
    }
    @Test
    public void checkImportSuccess() throws InterruptedException, IOException{
        CustomSocket a=new CustomSocket(8888);
        assertTrue(true);
    }
}
