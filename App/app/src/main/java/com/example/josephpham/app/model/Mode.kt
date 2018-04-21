package com.example.josephpham.app.model

import java.io.Serializable
import java.time.LocalDateTime
import java.util.*
import kotlin.collections.ArrayList

class Mode {
    var  id: String = ""
    var mode_name: String
    var status: Boolean
    var starttime: Int
    var stoptime: Int
    lateinit var circle: ArrayList<Int>
    var listDeviceInMode: ArrayList<DeviceInRoom> = ArrayList()
    constructor(id: String, mode_name: String, status: Boolean, starttime: Int, stoptime: Int, circle: ArrayList<Int>){
        this.id = id
        this.mode_name = mode_name
        this.status = status
        this.starttime = starttime
        this.stoptime = stoptime
        this.circle = circle
    }
    constructor(id: String, mode_name: String, status: Boolean, starttime: Int, stoptime: Int){
        this.id = id
        this.mode_name = mode_name
        this.status = status
        this.starttime = starttime
        this.stoptime = stoptime
    }
    constructor(mode_name: String, status: Boolean, starttime: Int, stoptime: Int, circle: ArrayList<Int>, listDeviceInMode: ArrayList<DeviceInRoom>){
        this.mode_name = mode_name
        this.status = status
        this.starttime = starttime
        this.stoptime = stoptime
        this.circle = circle
        this.listDeviceInMode = listDeviceInMode
    }
}