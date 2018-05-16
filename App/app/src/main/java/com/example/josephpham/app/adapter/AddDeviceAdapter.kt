package com.example.josephpham.app.adapter

import android.content.Context
import android.content.Intent
import android.support.v4.content.LocalBroadcastManager
import android.support.v7.widget.RecyclerView
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import com.example.josephpham.app.R
import com.example.josephpham.app.model.Device
import com.squareup.picasso.Picasso
import de.hdodenhof.circleimageview.CircleImageView
import kotlinx.android.synthetic.main.item_type_device.view.*
import kotlin.collections.ArrayList

class AddDeviceAdapter : RecyclerView.Adapter<AddDeviceAdapter.ViewHolder>{
    var listAllDevice: ArrayList<Device>
    var context: Context? = null

    constructor(context: Context, listDevice: ArrayList<Device>) {
        this.context = context
        this.listAllDevice = listDevice
    }
    override fun onBindViewHolder(holder: AddDeviceAdapter.ViewHolder, position: Int) {
        Picasso.get().load(listAllDevice.get(position).img.toString()).into(holder.imgdevice)
        Log.d("list_name",listAllDevice.get(position).name)
        holder.tvdevice.setText(listAllDevice.get(position).name.toString())
        holder.itemView.setOnClickListener {
            val intent = Intent("custom-message")
            intent.putExtra("_id", listAllDevice.get(position).id)
            intent.putExtra("img", listAllDevice.get(position).img)
            intent.putExtra("name", listAllDevice.get(position).name)
            intent.putExtra("price", listAllDevice.get(position).price.toString())
            LocalBroadcastManager.getInstance(context!!).sendBroadcast(intent)
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(context).inflate(R.layout.item_type_device, parent, false)
        return  ViewHolder(view)
    }

    override fun getItemCount(): Int {
        Log.d("size", listAllDevice.size.toString())
        return listAllDevice.size
    }

    inner class ViewHolder(mView: View) : RecyclerView.ViewHolder(mView) {
        val imgdevice: CircleImageView = mView.imgtypedevice
        val tvdevice: TextView = mView.tvtypedeivce
    }
}