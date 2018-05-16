package com.example.josephpham.app.activity

import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.support.v7.widget.LinearLayoutManager
import android.support.v7.widget.Toolbar
import android.util.Log
import com.example.josephpham.app.R
import android.view.View
import android.widget.Toast
import com.example.josephpham.app.adapter.AddRoomAdapter
import com.example.josephpham.app.model.DeviceInRoom
import com.example.josephpham.smarthome.sqlite.DatabaseHandler
import io.socket.emitter.Emitter
import kotlinx.android.synthetic.main.activity_add_room.*
import org.json.JSONArray
import org.json.JSONException
import org.json.JSONObject


class AddRoomActivity : AppCompatActivity() {
    companion object {
        var token : String = ""
        var listDeviceNotRoom = ArrayList<DeviceInRoom>()
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_add_room)
        val toolbar = findViewById<View>(R.id.toolbar4) as Toolbar
        setSupportActionBar(toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        val db = DatabaseHandler(this@AddRoomActivity)
        token = db.readData()

        emit()


        list_device.layoutManager = LinearLayoutManager(this@AddRoomActivity, LinearLayoutManager.HORIZONTAL, false)
        val adapter = AddRoomAdapter( this@AddRoomActivity)
        list_device.adapter = adapter
    }
    fun emit(){
        val json = JSONObject()
        json.put("id_user", MainActivity.user!!.id)
        json.put("token", MainActivity.token)
        MainActivity.mSocket.emit("client_send_device_no_room", json)
        MainActivity.mSocket.on("server_send_device_no_room", onretrieveDeviceNotRoom)
    }
    var onretrieveDeviceNotRoom: Emitter.Listener = Emitter.Listener { args ->
        runOnUiThread {
            val data = args[0] as JSONObject
            try {
                var correct = data.getBoolean("success")
                if(correct == true) {
                    var jsonArr = data.getJSONArray("listDevice")
                    for (i in 0.. jsonArr.length()-1){
                        var dataRoom: JSONObject = jsonArr.getJSONObject(i)
                        val device = DeviceInRoom.parseJson(dataRoom)
                        listDeviceNotRoom.add(device)
                    }
                }else{
                    val err = data.getString("message")
                    Toast.makeText(this, err.toString(), Toast.LENGTH_LONG).show()
                }
            } catch (e: JSONException) {
                Log.d("EEEE", e.toString())
            }
        }
    }
}
