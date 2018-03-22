package com.example.josephpham.smarthome.model

/**
 * Created by Joseph Pham on 12/11/2017.
 */
class Room {
    var id: Int= 0
    var id_user: Int = 0
    var name: String= ""
    var image: Int= 0
    constructor(id: Int, id_user: Int, name: String, image: Int){
        this.id = id
        this.id_user = id_user
        this.name = name
        this.image = image
    }
}