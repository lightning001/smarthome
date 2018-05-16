package com.example.josephpham.app.model

import org.json.JSONObject

class DeviceInRoom {
    var id: String = ""
    var device: Device? = null
    var device_name: String = ""
    var status : Boolean = false
    var listKeyOnOff: ArrayList<KeyOnOffDevice>? = null

    constructor(id: String, device: Device, device_name: String, status: Boolean){
        this.id = id
        this.device = device
        this.device_name = device_name
        this.status = status
    }
    constructor() {
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