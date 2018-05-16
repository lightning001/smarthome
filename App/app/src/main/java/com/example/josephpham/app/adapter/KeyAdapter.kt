package com.example.josephpham.app.adapter

import android.content.Context
import android.support.v7.widget.RecyclerView
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import com.example.josephpham.app.R
import com.example.josephpham.app.model.KeyOnOffDevice
import com.squareup.picasso.Picasso
import kotlinx.android.synthetic.main.item_key.view.*

class KeyAdapter: RecyclerView.Adapter<KeyAdapter.ViewHolder>{


    var listkey = ArrayList<KeyOnOffDevice>()
    var context: Context? = null

    constructor(context: Context) {
        this.context = context
    }
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(context).inflate(R.layout.item_key, parent, false)
        return  ViewHolder(view)
    }

    override fun getItemCount(): Int {
        return listkey.size
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.key.setText(listkey.get(position).off)
    }


    inner class ViewHolder(mView: View) : RecyclerView.ViewHolder(mView) {
        val key: TextView = mView.tv_key

    }
}