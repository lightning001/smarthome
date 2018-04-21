package com.example.josephpham.app.adapter

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.BaseAdapter
import com.example.josephpham.app.R
import com.example.josephpham.app.model.Room
import kotlinx.android.synthetic.main.room.view.*

class RoomAdapter: BaseAdapter {

    var roomsList = ArrayList<Room>()
    var context: Context? = null

    constructor(context: Context, roomList: ArrayList<Room>){
        this.context = context
        this.roomsList = roomList
    }

    override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
        val room = this.roomsList[position]

        var inflator = context!!.getSystemService(Context.LAYOUT_INFLATER_SERVICE) as LayoutInflater
        var roomView = inflator.inflate(R.layout.room, null)
        roomView.imgroom.setImageResource(R.drawable.phongkhach)
        roomView.tvroom.text = room.room
        return roomView
    }

    override fun getItem(position: Int): Any {
        return roomsList[position]
    }
    override fun getItemId(position: Int): Long {
        return position.toLong()
    }

    override fun getCount(): Int {
        return roomsList.size
    }
}