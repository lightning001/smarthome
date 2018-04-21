package com.example.josephpham.app.model

import java.io.Serializable


class Room {
    var id: String
    var room: String =""
    var img: String= ""
    var listDeviceInRoom: ArrayList<DeviceInRoom>? = null
    constructor(id: String, room: String, img: String, listDeviceInRoom: ArrayList<DeviceInRoom>){
        this.id = id
        this.room = room
        this.img = img
        this.listDeviceInRoom = listDeviceInRoom
    }
    constructor(id: String, room: String, img: String){
        this.id = id
        this.room = room
        this.img = img
    }
}