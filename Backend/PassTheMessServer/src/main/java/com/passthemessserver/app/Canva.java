package com.passthemessserver.app;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class Canva {
    private String canvaText;
    public Canva(String canvaText){
      this.canvaText=canvaText;
    }
    public String getCanva(){
      return canvaText;
    }
    public void setCanva(String canvaText){
      this.canvaText=canvaText;
    }
}
