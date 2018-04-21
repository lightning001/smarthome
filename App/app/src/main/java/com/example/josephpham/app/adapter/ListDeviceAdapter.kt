package com.example.josephpham.app.adapter

import android.support.v7.widget.RecyclerView
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import com.example.josephpham.app.R
import com.example.josephpham.app.activity.Main2Activity
import com.example.josephpham.app.activity.MainActivity
import com.example.josephpham.app.model.DeviceInRoom
import com.squareup.picasso.Picasso
import kotlinx.android.synthetic.main.item_device.view.*
import kotlin.collections.ArrayList

class ListDeviceAdapter : RecyclerView.Adapter<ListDeviceAdapter.ViewHolder>(){

    var listDevice = MainActivity.listDeviceNotRoom
    var mInflater: LayoutInflater? = null

//    constructor(listDevice: ArrayList<DeviceInRoom>) {
//        this.listDevice = listDevice
//    }
    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        var device: DeviceInRoom = listDevice!!.get(position)

        holder.mTvDevice.text = device.device_name
        Picasso.get().load(device.device!!.img).into(holder.mImgDevice)

    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder{
        if (mInflater  == null) {
            mInflater  = LayoutInflater.from(parent.context)
        }
        val v = mInflater!!.inflate(R.layout.item_device, parent, false)
        return ViewHolder(v)

    }

    override fun getItemCount(): Int {
        return listDevice!!.size
    }
    inner class ViewHolder(mView: View) : RecyclerView.ViewHolder(mView) {
        val mImgDevice: ImageView = mView.imgdevice
        val mTvDevice: TextView = mView.tvdevice
    }

}

