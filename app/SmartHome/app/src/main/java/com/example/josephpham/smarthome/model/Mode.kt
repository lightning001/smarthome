package com.example.josephpham.smarthome.model

import java.time.LocalDateTime
import java.util.*

/**
 * Created by Joseph Pham on 1/8/2018.
 */
class Mode {
    var id:Int = 0
    var mode_name: String =""
    var id_user: Int =  0
    var status: Int = 0
    var start_time : Date? = null
    var end_time : Date? = null
    constructor(id: Int, mode_name: String, id_user: Int, status: Int){
        this.id = id
        this.mode_name = mode_name
        this.id_user = id_user
        this.status = status
    }
    constructor(id: Int, mode_name: String, id_user: Int, status: Int, start_time: Date, end_time: Date){
        this.id = id
        this.mode_name = mode_name
        this.id_user = id_user
        this.status = status
        this.start_time = start_time
        this.end_time = end_time
    }
}