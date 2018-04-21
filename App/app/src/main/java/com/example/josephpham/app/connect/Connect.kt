package com.example.josephpham.app.connect

import android.util.Log
import io.socket.client.IO
import io.socket.client.Socket

class Connect {
    companion object {
        var msocket: Socket? = null
        fun connect(): Socket{
            if(msocket == null){
                msocket = IO.socket("http://192.168.1.14:3000")
                msocket?.connect()
            }
            return msocket!!

        }
        fun disConnect(): Socket{
            if(msocket != null){
                msocket!!.disconnect()
            }
            return msocket!!
        }
    }
}