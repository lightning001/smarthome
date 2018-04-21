package com.example.josephpham.app.adapter

import android.content.Context
import android.os.Build
import android.support.v7.widget.RecyclerView
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Switch
import android.widget.TextView
import com.example.josephpham.app.R
import com.example.josephpham.app.model.Mode
import kotlinx.android.synthetic.main.mode.view.*
import java.io.BufferedReader
import java.text.ParseException
import java.text.SimpleDateFormat
import java.util.*
import kotlin.collections.ArrayList

class ModeAdapter : RecyclerView.Adapter<ModeAdapter.ViewHolder>{

    var listMode: ArrayList<Mode>? = null
    var mInflater: LayoutInflater? = null

    constructor(listMode: ArrayList<Mode>) {
        this.listMode = listMode
    }
    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        var mstart = StringBuffer()
        var mode: Mode = listMode!!.get(position)
        val hh = mode.starttime / 100
        val mm = mode.starttime % 100
        if(hh < 10){
            mstart = mstart.append("0" + hh)
        }else{
            mstart = mstart.append(hh)
        }
        mstart = mstart.append(":")
        if (mm < 10){
            mstart = mstart.append("0" + mm)
        }else{
            mstart = mstart.append(mm)
        }
        var mend = StringBuffer()
        val hh1 = mode.stoptime / 100
        val mm1 = mode.stoptime % 100
        if (hh1 < 10){
            mend = mend.append("0" + hh1)
        }else{
            mend = mend.append(hh1)
        }
        mend = mend.append(":")
        if (mm1 < 10){
            mend = mend.append( "0" + mm1)
        }else {
            mend = mend.append(mm1)
        }
        holder.mName_Mode.text = mode.mode_name

        holder.time.text = "" + mstart + " - " + mend

        holder.mSwitch.isChecked = mode.status
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder{
        if (mInflater  == null) {
            mInflater  = LayoutInflater.from(parent.context)
        }
        val v = mInflater!!.inflate(R.layout.mode, parent, false)
        return ViewHolder(v)

    }

    override fun getItemCount(): Int {
        return listMode!!.size
    }
    inner class ViewHolder(mView: View) : RecyclerView.ViewHolder(mView) {
        val mName_Mode: TextView = mView.name_mode
        val mSwitch: Switch = mView.timeid
        val time: TextView = mView.time
    }

}

