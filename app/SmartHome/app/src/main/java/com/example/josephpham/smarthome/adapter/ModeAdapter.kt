package com.example.josephpham.smarthome.adapter

import android.content.Context
import android.support.v7.widget.RecyclerView
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Switch
import android.widget.TextView
import com.example.josephpham.smarthome.R

import com.example.josephpham.smarthome.model.Mode
import kotlinx.android.synthetic.main.mode.view.*


class ModeAdapter(mcontext: Context, mListModes: ArrayList<Mode>) : RecyclerView.Adapter<ModeAdapter.ViewHolder>() {
    val context = mcontext
    val list = mListModes

    override fun onBindViewHolder(holder: ViewHolder?, position: Int) {
        val mode: Mode = list.get(position)

        holder?.mName_Mode?.text = mode.mode_name
        holder?.mSwitch?.text = mode.start_time.toString() + " - "  + mode.end_time.toString()
    }

    override fun onCreateViewHolder(parent: ViewGroup?, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(context).inflate(R.layout.mode, parent, false)
        return  ViewHolder(view)
    }

    override fun getItemCount(): Int {
        return list.size
    }


    inner class ViewHolder(mView: View) : RecyclerView.ViewHolder(mView) {
        val mName_Mode: TextView = mView.name_mode
        val mSwitch: Switch = mView.simpleSwitch


    }
}
