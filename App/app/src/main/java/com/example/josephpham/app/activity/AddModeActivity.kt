package com.example.josephpham.app.activity

import android.app.TimePickerDialog
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.support.v7.widget.LinearLayoutManager
import android.support.v7.widget.Toolbar
import android.util.Log
import android.view.View
import android.widget.TimePicker
import android.widget.Toast
import com.example.josephpham.app.R
import com.example.josephpham.app.adapter.AddModeAdapter
import com.example.josephpham.app.model.DeviceInRoom
import com.example.josephpham.app.model.Mode
import io.socket.emitter.Emitter
import kotlinx.android.synthetic.main.activity_add_mode.*
import org.json.JSONException
import org.json.JSONObject
import java.util.*
import kotlin.collections.ArrayList

class AddModeActivity : AppCompatActivity(), TimePickerDialog.OnTimeSetListener{
    companion object {
        var listDeviceNotRoom = ArrayList<DeviceInRoom>()
    }
    var choose: Boolean= false

    override fun onTimeSet(view: TimePicker?, hourOfDay: Int, minute: Int) {

        if (choose == true) {
            textView6.setText("" + hourOfDay  + ":" + minute )
        }else{
            textView7.setText("" + hourOfDay  + ":" + minute)
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_add_mode)
        emit()
        addEvent()
        addlist()

        val toolbar = findViewById<View>(R.id.toolbar3) as Toolbar
        setSupportActionBar(toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)

    }

    private fun emit() {
        val bundle = intent.extras
        val idUser = bundle.getString("id_user")
        val token = bundle.getString("token")
        val json = JSONObject()
        json.put("id_user", idUser)
        json.put("token", token)
        Main2Activity.mSocket.emit("client_send_device_no_room", json)
        Main2Activity.mSocket.on("server_send_device_no_room", onretrieveDeviceNotRoom)

    }

    private fun addEvent() {
        textView6.setOnClickListener { view ->
            choose = true
            val calendar = Calendar.getInstance()
            val hour = calendar.get(Calendar.HOUR_OF_DAY)
            val minute = calendar.get(Calendar.MINUTE)
            val timpicker = TimePickerDialog(this@AddModeActivity, this@AddModeActivity as TimePickerDialog.OnTimeSetListener?, hour, minute, android.text.format.DateFormat.is24HourFormat(this@AddModeActivity))
            timpicker.show()

        }
        textView7.setOnClickListener { view ->
            choose = false
            val calendar = Calendar.getInstance()
            val hourend = calendar.get(Calendar.HOUR_OF_DAY)
            val minuteend = calendar.get(Calendar.MINUTE)
            val timpickerend = TimePickerDialog(this@AddModeActivity, this@AddModeActivity as TimePickerDialog.OnTimeSetListener?, hourend, minuteend, android.text.format.DateFormat.is24HourFormat(this@AddModeActivity))
            timpickerend.show()
        }
        val mCircle = circle()
        btnCreateMode.setOnClickListener(View.OnClickListener {
            btncreate(mCircle)
        })
    }


    fun btncreate(mCircle:  ArrayList<Int>){
        val mName = tvNameMode.text.toString()
        var mListDevice = ArrayList<DeviceInRoom>()
        for (i in 0.. listDeviceNotRoom.size -1) {
            if (listDeviceNotRoom.get(i).status == true) {
                mListDevice.add(listDeviceNotRoom.get(i))
            }
        }
        val startTime = textView6.text
        val endTime = textView7.text
        val timeArray = startTime.split(":")
        val HH = Integer.parseInt(timeArray[0])
        val mm = Integer.parseInt(timeArray[1])
        val s = HH*100 + mm
        val timeArray1 = endTime.split(":")
        val HH1 = Integer.parseInt(timeArray1[0])
        val mm1 = Integer.parseInt(timeArray1[1])
        val s1 = HH1*100 + mm1
        checkName()
        val mMode = Mode(mName, true, s, s1, mCircle, mListDevice)
        Log.d("mode", mMode.mode_name + ", " + mMode.starttime + " " + mMode.stoptime)

    }
    fun checkName(){
        tvNameMode.error = null
        var cancel = false
        var focusView: View? = null
        // Check for a valid password, if the user entered one.
        if (tvNameMode.text.isEmpty()) {
            tvNameMode.error = getString(R.string.error_invalid_mode_name)
            focusView = tvNameMode
            cancel = true
        }
        if (cancel) {
            focusView?.requestFocus()
        }
    }
    fun addlist(){
        list_device.layoutManager = LinearLayoutManager(this@AddModeActivity, LinearLayoutManager.HORIZONTAL, false)
        val adapter = AddModeAdapter(this@AddModeActivity)
        list_device.adapter = adapter
    }
    fun circle(): ArrayList<Int>{
        val mCircle = ArrayList<Int>()
        for (i in 0.. 7){
            mCircle.add(0)
        }
        imgt2.setOnClickListener(){
            if(mCircle.get(0) == 0) {
                imgt2.setImageResource(R.drawable.ic_monday1)
                mCircle[0] = 1
            }else{
                imgt2.setImageResource(R.drawable.ic_monday)
                mCircle[0] = 0
            }
        }
        imgt3.setOnClickListener(){
            if(mCircle.get(1) == 0) {
                imgt3.setImageResource(R.drawable.ic_tuesday1)
                mCircle[1] = 1
            }else{
                imgt3.setImageResource(R.drawable.ic_tuesday_)
                mCircle[1] = 0
            }
        }
        imgt4.setOnClickListener(){
            if(mCircle.get(2) == 0) {
                imgt4.setImageResource(R.drawable.ic_wednesday1)
                mCircle[2] = 1
            }else{
                imgt4.setImageResource(R.drawable.ic_wednesday)
                mCircle[2] = 0
            }
        }
        imgt5.setOnClickListener(){
            if(mCircle.get(3) == 0) {
                imgt5.setImageResource(R.drawable.ic_thursday1)
                mCircle[3] = 1
            }else{
                imgt5.setImageResource(R.drawable.ic_thursday)
                mCircle[3] = 0
            }
        }
        imgt6.setOnClickListener(){
            if(mCircle.get(4) == 0) {
                imgt6.setImageResource(R.drawable.ic_friday1)
                mCircle[4] = 1
            }else{
                imgt6.setImageResource(R.drawable.ic_friday)
                mCircle[4] = 0
            }
        }
        imgt7.setOnClickListener(){
            if(mCircle.get(5) == 0) {
                imgt7.setImageResource(R.drawable.ic_saturday1)
                mCircle[5] = 1
            }else{
                imgt7.setImageResource(R.drawable.ic_saturday)
                mCircle[5] = 0
            }
        }
        imgcn.setOnClickListener(){
            if(mCircle.get(6) == 0) {
                imgcn.setImageResource(R.drawable.ic_saturday1)
                mCircle[6] = 1
            }else{
                imgcn.setImageResource(R.drawable.ic_saturday)
                mCircle[6] = 0
            }
        }
        return mCircle
    }
    var onretrieveDeviceNotRoom: Emitter.Listener = Emitter.Listener { args ->
        runOnUiThread {
            val data1 = args[0] as JSONObject
            try {
                var correct = data1.getBoolean("error")
                if(correct != true) {
                    var roomJson = data1.getJSONArray("Result")
                    for (i in 0.. roomJson.length()-1){
                        var dataDevice: JSONObject = roomJson.getJSONObject(i)
                        val device = DeviceInRoom.parseJson(dataDevice)
                        listDeviceNotRoom.add(device)
                    }


                }else{
                    val err = data1.getString("Result")
                    Toast.makeText(this, err.toString(), Toast.LENGTH_LONG).show()
                }
            } catch (e: JSONException) {
                Log.d("EEEE", e.toString())
            }
        }
    }
}

