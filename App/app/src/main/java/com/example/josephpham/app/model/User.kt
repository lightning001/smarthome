package com.example.josephpham.app.model


import android.annotation.SuppressLint
import android.util.Log
import org.json.JSONArray
import org.json.JSONObject
import java.io.Serializable
import java.text.SimpleDateFormat
import java.util.*
import kotlin.collections.ArrayList

class User{
    var id: String = ""
    var email: String = ""
    var password: String = ""
    var street: String = ""
    var district: String= ""
    var city: String= ""
    var postcode: Int= 0
    var phonenumber: String= ""
    var homephone: String= ""
    var dob : Date?= null
    var type: String = ""
    var status : Boolean = false
    var startdateregister : Date? = null
    var name : String= ""
    var img: String= ""
    var listRoom: ArrayList<Room> = ArrayList()
    var listMode: ArrayList<Mode> = ArrayList()
    constructor(){

    }

    constructor(id: String, email: String, password: String, street: String, district: String, city: String, postcode: Int, phonenumber: String,
                homephone: String, dob : Date, type: String, status : Boolean, startdateregister : Date, name : String, img: String,
                listRoom: ArrayList<Room>, listMode: ArrayList<Mode>) {
        this.id = id
        this.email = email
        this.password = password
        this.street = street
        this.district = district
        this.city = city
        this.postcode = postcode
        this.phonenumber = phonenumber
        this.homephone = homephone
        this.dob = dob
        this.type = type
        this.status = status
        this.startdateregister = startdateregister
        this.name = name
        this.img = img
        this.listRoom = listRoom
        this.listMode = listMode

    }
    constructor(id: String, email: String, street: String, district: String, city: String, postcode: Int, phonenumber: String,
                homephone: String, dob : Date, type: String, status : Boolean, startdateregister : Date, name : String, img: String,
                listRoom: ArrayList<Room>) {
        this.id = id
        this.email = email
        this.street = street
        this.district = district
        this.city = city
        this.postcode = postcode
        this.phonenumber = phonenumber
        this.homephone = homephone
        this.dob = dob
        this.type = type
        this.status = status
        this.startdateregister = startdateregister
        this.name = name
        this.img = img
        this.listRoom = listRoom

    }

    companion object {
        fun parseJson(data: JSONObject): User {
            var simpleDateFormat: SimpleDateFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm")
            val id: String = data.getString("_id")
            val email: String = data.getString("email")
            val name: String = data.getString("name")
            val street: String = data.getString("street")
            val district: String = data.getString("district")
            val city: String = data.getString("city")
            val postcode: Int = data.getInt("postcode")
            val phonenumber: String = data.getString("phonenumber")
            val homephone: String = data.getString("homephone")
            val dob: Date = simpleDateFormat.parse(data.getString("dob"))
            val type: String = data.getString("type")
            val status: Boolean = data.getBoolean("status")
            val startdateregister: Date = simpleDateFormat.parse(data.getString("startdateregister"))
            val img: String = data.getString("img")
            val listRoom = data.getJSONArray("listRoom")
            var mListRoom: ArrayList<Room> = ArrayList()
            for (i in 0..listRoom.length() - 1) {
                val room: JSONObject = listRoom.getJSONObject(i) as JSONObject
                val id_Room = room.getString("_id")
                val name_room = room.getString("room_name")
                val img = room.getString("img")
                val mRoom: Room = Room(id_Room, name_room, img)
                mListRoom.add(mRoom)
            }
//            val listMode = data.getJSONArray("listMode")
//            var arrmode: ArrayList<Mode> = ArrayList()
//            for (i in 0..listMode.length() - 1) {
//                val mode: JSONObject = listMode.getJSONObject(i) as JSONObject
//
//                val id_Mode = mode.getString("_id")
//                val modename = mode.getString("mode_name")
//                val status = mode.getBoolean("status")
//                val starttime = mode.getInt("starttime")
//                val stoptime = mode.getInt("stoptime")
//                val circle: JSONArray = mode.getJSONArray("circle")
//                var mCircle: ArrayList<Int> = ArrayList()
//                for (j in 0..circle.length() - 1) {
//                    mCircle.add(circle.getInt(j))
//                }
//                var mMode: Mode = Mode(id_Mode, modename, status, starttime, stoptime, mCircle)
//                arrmode.add(mMode)
//            }

            var user = User(id, email, street, district, city, postcode,
                    phonenumber, homephone, dob, type, status, startdateregister, name, img, mListRoom)

            return user
        }
    }

}