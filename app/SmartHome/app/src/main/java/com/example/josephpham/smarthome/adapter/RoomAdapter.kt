package com.example.josephpham.smarthome.adapter

import android.content.Context
import android.content.Intent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import com.example.josephpham.smarthome.R
import com.example.josephpham.smarthome.model.Room
import kotlinx.android.synthetic.main.room.view.*
import java.util.*


/**
 * Created by Joseph Pham on 12/11/2017.
 */
class RoomAdapter : BaseAdapter {
    var RoomsList = ArrayList<Room>()
    var context: Context? = null

    constructor(context: Context, foodsList: ArrayList<Room>) : super() {
        this.context = context
        this.RoomsList = foodsList
    }

    override fun getCount(): Int {
        return RoomsList.size
    }

    override fun getItem(position: Int): Any {
        return RoomsList[position]
    }

    override fun getItemId(position: Int): Long {
        return position.toLong()
    }

    override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
        val room = this.RoomsList[position]

        var inflator = context!!.getSystemService(Context.LAYOUT_INFLATER_SERVICE) as LayoutInflater
        var roomView = inflator.inflate(R.layout.room, null)
        roomView.imgroom.setImageResource(room.image)
        roomView.tvroom.text = room.name
        return roomView

    }

//    override fun getView(p0: Int, p1: View?, parent: ViewGroup?): View {
//        var view : View?
//        var viewHolder : ViewHolder
//        if (p1 == null){
//            val itemLayoutView = LayoutInflater.from(parent?.context)
//            view = itemLayoutView.inflate(R.layout.room, parent, false)
//            viewHolder = ViewHolder(view)
//            view.tag = viewHolder
//        }else{
//            view = p1
//            viewHolder = view.tag as ViewHolder
//        }
//        var department: Room = getItem(p0) as Room
//        viewHolder.imgroom.setImageResource(department.image)
//        viewHolder.tvroomname.setText(department.name)
//        return view as View
//    }
//
//    override fun getItem(p0: Int): Any {
//        return arraydepartment.get(p0)
//    }
//
//    override fun getItemId(p0: Int): Long {
//        return p0.toLong()
//    }
//
//    override fun getCount(): Int {
//        return arraydepartment.size
//    }
//    inner class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
//        var tvroomname : TextView = itemView.findViewById(R.id.tvroom)
//        var imgroom : ImageView = itemView.findViewById(R.id.imgroom)
//    }
//    override fun onBindViewHolder(holder: ViewHolder, position: Int){
//        var room: Room = arraydepartment.get(position)
//        holder.tvdepartmentname.setText(room.name)
//        holder.imgadepartment.setImageResource(room.image)
//
//        holder.itemView.setOnClickListener(object : View.OnClickListener {
//            override fun onClick(v: View?) {
//                val intent : Intent = Intent(context, MainActivity_second::class.java)
//                intent.putExtra("id",arraydepartment.get(position).id)
////                Log.e("AAA", arraydepartment.get(position).id.toString())
//                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
//                context.startActivity(intent)
//            }
//        })
//        holder.itemView.setOnLongClickListener(object : View.OnLongClickListener{
//            override fun onLongClick(p0: View?): Boolean {
//                val intent : Intent = Intent(context, SettingDepartment::class.java)
//                intent.putExtra("id",arraydepartment.get(position).id)
//                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
//                context.startActivity(intent)
//                return true
//            }
//        })
//    }
//
//    public fun additem(position: Int, room: Room) {
//        arraydepartment.add(position, room)
//        notifyItemInserted(position)
//    }
//
//    override fun onCreateViewHolder(parent: ViewGroup?, viewType: Int): ViewHolder {
////        val itemLayoutView = LayoutInflater.from(parent?.context).inflate(
////                R.layout.room,parent, false)
//        var itemLayoutView : View = LayoutInflater.from(parent?.context).inflate(R.layout.room, parent, false)
//
//        var  viewholder = ViewHolder(itemLayoutView)
//        return viewholder
//    }
//
//    override fun getItemCount(): Int {
//        return arraydepartment.size
//    }
//

////    fun remove(item: Room) {
////        var position: Int = arraydepartment.indexOf(item);
////        arraydepartment.removeAt(position);
////        notifyItemRemoved(position);
////    }

}