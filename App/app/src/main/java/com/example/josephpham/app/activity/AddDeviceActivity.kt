package com.example.josephpham.app.activity

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.support.v4.content.LocalBroadcastManager
import android.support.v7.widget.LinearLayoutManager
import com.example.josephpham.app.R
import com.example.josephpham.app.adapter.AddDeviceAdapter
import com.example.josephpham.app.model.Device
import kotlinx.android.synthetic.main.activity_add_device.*
import kotlin.collections.ArrayList
import android.util.Log
import android.widget.Toast
import com.example.josephpham.smarthome.sqlite.DatabaseHandler
import com.squareup.picasso.Picasso
import io.socket.client.Socket
import io.socket.emitter.Emitter
import org.json.JSONException
import org.json.JSONObject


class AddDeviceActivity : AppCompatActivity(){
    var mSocket: Socket = LoginActivity.msocket
    var token : String = ""
    var list = ArrayList<Device>()


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_add_device)
        setSupportActionBar(toolbar_add_device)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        val db = DatabaseHandler(this@AddDeviceActivity)
        token = db.readData()
        emit(token)
        mSocket.on("server_send_list_device", onretrieveDataListDevice)
        controll()
        LocalBroadcastManager.getInstance(this).registerReceiver(mMessageReceiver,
                 IntentFilter("custom-message"));
    }

    private fun emit(token: String) {
        mSocket.emit("client_send_list_device", token)
    }

    private fun controll() {
        list_type_device.layoutManager = LinearLayoutManager(this@AddDeviceActivity, LinearLayoutManager.HORIZONTAL, false)
        val adapter = AddDeviceAdapter(this@AddDeviceActivity, list)
        list_type_device.adapter = adapter
    }

    //get data from Adapter
    var mMessageReceiver: BroadcastReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context, intent: Intent) {
            // Get extra data included in the Intent
            val name = intent.getStringExtra("name")
            val id = intent.getStringExtra("_id")
            val itemimg = intent.getStringExtra("img")
            val itemprice = intent.getStringExtra("price")
            Picasso.get().load(itemimg).into(img_type_device)
            tv_price.setText(itemprice)
            tv_type_device.setText(name)
            createDevice(name)
            Toast.makeText(this@AddDeviceActivity, name , Toast.LENGTH_SHORT).show()
        }
    }

    fun createDevice(id: String){
        val bundle = intent.extras
        val idUser = bundle.get("id_user")
        val deviceName = edt_name_device.text
        val json = JSONObject()
        json.put("device",id)
        json.put("device_name", deviceName)
        json.put("user", idUser)
        json.put("token", token)
        mSocket.emit("clien_send_create_device_in_room", json)
        mSocket.on("server_send_create_device_in_room", onretrieveReslt)

    }
    var onretrieveDataListDevice: Emitter.Listener = Emitter.Listener { args ->
        runOnUiThread {
            val data = args[0] as JSONObject
            try {
                var correct = data.getBoolean("success")
                if(correct == true) {
                    var jsonArr = data.getJSONArray("result")
                    for (i in 0.. jsonArr.length()-1){
                        var dataRoom: JSONObject = jsonArr.getJSONObject(i)
                        val device = Device.parseJson(dataRoom)
                        list.add(device)
                    }
//                    val listMode = user.listMode
                    val intent: Intent = Intent(this@AddDeviceActivity, Main2Activity::class.java)
                    startActivity(intent)
                }else{
                    val err = data.getString("message")
                    Toast.makeText(this, err.toString(), Toast.LENGTH_LONG).show()
                }
            } catch (e: JSONException) {
                Log.d("listDevice", e.toString())
            }
        }
    }
    var onretrieveReslt: Emitter.Listener = Emitter.Listener { args ->
        runOnUiThread {
            val data = args[0] as JSONObject
            try {
                var correct = data.getBoolean("success")
                if(correct == true) {
                    Toast.makeText(this@AddDeviceActivity, "device was created", Toast.LENGTH_LONG).show()
                }else{
                    val err = data.getString("message")
                    Toast.makeText(this, err.toString(), Toast.LENGTH_LONG).show()
                }
            } catch (e: JSONException) {
                Log.d("listDevice", e.toString())
            }
        }
    }


}
