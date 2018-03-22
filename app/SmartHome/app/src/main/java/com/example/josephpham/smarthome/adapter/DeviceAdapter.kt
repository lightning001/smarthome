package com.example.josephpham.smarthome.adapter

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.BaseAdapter
import com.example.josephpham.smarthome.R
import com.example.josephpham.smarthome.model.Mode
import kotlinx.android.synthetic.main.device.view.*
import java.util.ArrayList

/**
 * Created by Joseph Pham on 1/8/2018.
 */
class DeviceAdapter : BaseAdapter {
    var ModeList = ArrayList<Mode>()
    var context: Context? = null

    constructor(context: Context, modesList: ArrayList<Mode>) : super() {
        this.context = context
        this.ModeList = modesList
    }

    override fun getCount(): Int {
        return ModeList.size
    }

    override fun getItem(position: Int): Any {
        return ModeList[position]
    }

    override fun getItemId(position: Int): Long {
        return position.toLong()
    }

    override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
        val button = this.ModeList[position]

        var inflator = context!!.getSystemService(Context.LAYOUT_INFLATER_SERVICE) as LayoutInflater
        var buttonView = inflator.inflate(R.layout.device, null)
        if(button.status == 0){
//            buttonView.tvstatus.text = "off"
            buttonView.imgbutton.setImageResource(R.drawable.on)
        }else{
            buttonView.imgbutton.setImageResource(R.drawable.off)
        }
        buttonView.tvdevice.text = button.mode_name
        return buttonView
    }
}