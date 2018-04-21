package com.example.josephpham.app.model

import com.example.josephpham.app.R
import org.json.JSONObject
import java.io.Serializable

class Device {
    var id: String= ""
    var name: String= ""
    var img: String=""
    var description: String= ""
    var price: Double= 0.0
    var type : Int
     constructor(id: String, name: String, img: String, description: String, price: Double, type: Int){
         this.id = id
         this.name = name
         this.img = img
         this.description = description
         this.price = price
         this.type = type
     }
    companion object {
        fun parseJson(data : JSONObject): Device{
            val device_id =  data.getString("_id")
            val device_name = data.getString("name")
            val img = data.getString("img")
            val description = data.getString("description")
            val price = data.getDouble("price")
            val type = data.getInt("type")
            val device = Device(device_id, device_name, img, description, price, type)
            return device
        }
    }

}