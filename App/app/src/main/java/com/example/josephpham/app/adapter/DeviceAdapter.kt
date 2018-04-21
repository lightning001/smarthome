package com.example.josephpham.app.adapter

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.BaseAdapter
import com.example.josephpham.app.R
import com.example.josephpham.app.model.DeviceInRoom
import kotlinx.android.synthetic.main.device.view.*

class DeviceAdapter: BaseAdapter {
    var deviceList = ArrayList<DeviceInRoom>()
    var context: Context? = null
    constructor(deviceList: ArrayList<DeviceInRoom>, context: Context){
        this.context = context
        this.deviceList = deviceList
    }

    override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
        var device = this.deviceList.get(position)
        var inflator = context!!.getSystemService(Context.LAYOUT_INFLATER_SERVICE) as LayoutInflater
        var deviceView = inflator.inflate(R.layout.device, null)
        if (device.device!!.type == 1) {//id_device = 0 laf thiet bi bat tac
            if (device.status == false) {
                deviceView.imgdevice.setImageResource(R.drawable.off)
            } else {
                deviceView.imgdevice.setImageResource(R.drawable.on)
            }
        }
        deviceView.tvdeivce.setText(device.device_name)
        return deviceView

    }

    override fun getItem(position: Int): Any {
        return deviceList.get(position)

    }

    override fun getItemId(position: Int): Long {
        return position.toLong()
    }

    override fun getCount(): Int {
        return deviceList.size
    }
}

