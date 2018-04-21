package com.example.josephpham.app.model

import com.example.josephpham.app.R.id.img
import org.json.JSONObject
import java.io.Serializable

class DeviceInRoom {
    var id: String = ""
    var device: Device? = null
    var device_name: String = ""
    var status : Boolean = false

    constructor(id: String, device: Device, device_name: String, status: Boolean){
        this.id = id
        this.device = device
        this.device_name = device_name
        this.status = status
    }
    constructor(){

    }
//    fun createDevice(): ArrayList<DeviceInRoom>{
//        var arr: ArrayList<DeviceInRoom> = ArrayList()
//        var device1 = Device(1,"bongden","alsjdfasdf", "bongdensang25v", 25.0)
//        var device2 = Device(0,"quat","alsjdfasdf", "quan tran", 35.0)
//        arr.add(DeviceInRoom(1, device1, "thietbi1", false))
//        arr.add(DeviceInRoom(2, device2, "thietbi2", false))
//        arr.add(DeviceInRoom(3, device1, "thietbi3", true))
//        arr.add(DeviceInRoom(4, device1, "thietbi4", true))
//        return arr
//    }
    fun checkDevice(): Boolean{
        return status
    }

    fun setSelected(status: Boolean) {
        this.status = status
    }
    companion object {
        fun parseJson(dataRoom: JSONObject): DeviceInRoom{
            val id = dataRoom.getString("_id")
            val name = dataRoom.getString("device_name")
            val status = dataRoom.getBoolean("status")
            // device
            val deviceJoson = dataRoom.getJSONObject("device")
            val device = Device.parseJson(deviceJoson)
            val deviceInRoom = DeviceInRoom(id, device, name, status)
            return deviceInRoom

        }
    }

}