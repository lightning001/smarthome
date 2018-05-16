package com.example.josephpham.app.frament

import android.annotation.SuppressLint
import android.app.Activity
import android.content.Intent
import android.content.Intent.getIntent
import android.os.Bundle
import android.support.design.widget.Snackbar
import android.support.v4.app.Fragment
import android.support.v4.app.FragmentActivity
import android.util.Log
import android.view.LayoutInflater
import android.view.MenuItem
import android.view.View
import android.view.ViewGroup
import android.widget.PopupMenu
import android.widget.Toast
import com.example.josephpham.app.R
import com.example.josephpham.app.R.layout.fragment_device
import com.example.josephpham.app.activity.LoginActivity
import com.example.josephpham.app.activity.Main2Activity
import com.example.josephpham.app.activity.MainActivity
import com.example.josephpham.app.activity.SettingDeviceActivity
import com.example.josephpham.app.adapter.DeviceAdapter
import com.example.josephpham.app.model.Device
import com.example.josephpham.app.model.DeviceInRoom
import io.socket.client.Socket
import io.socket.emitter.Emitter
import kotlinx.android.synthetic.main.device.*
import kotlinx.android.synthetic.main.fragment_device.*
import kotlinx.android.synthetic.main.fragment_device.view.*
import org.json.JSONException
import org.json.JSONObject

class Tab_Device: Fragment() {
    var activity: Activity? = null
    val listDeviceInRoom = Main2Activity.listDeviceInRoom

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?,
                              savedInstanceState: Bundle?): View? {
        val rootView = inflater.inflate(R.layout.fragment_device, container, false)
        return rootView
    }
    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
        activity = getActivity()
        if (activity != null){
            val adapter = DeviceAdapter(listDeviceInRoom, activity as FragmentActivity)
            device.adapter = adapter
            device.setOnItemClickListener { parent, view, position, id ->
                pupomenu.setOnClickListener {
                    val popupMenu = PopupMenu(activity, pupomenu)
                    popupMenu.menuInflater.inflate(R.menu.popup_menu_item_device, popupMenu.menu)
                    popupMenu.setOnMenuItemClickListener(PopupMenu.OnMenuItemClickListener { item: MenuItem? ->
                        when (item!!.itemId) {
                            R.id.delete -> {
                            }
                            R.id.update -> {
                            }
                            R.id.settings -> {
                                val intent: Intent = Intent(activity, SettingDeviceActivity::class.java)
                                intent.putExtra("id_device_in_room", listDeviceInRoom.get(position).id)
                                startActivity(intent)
                            }
                        }

                        true
                    })
                    popupMenu.show()
                }
            }

        }
    }
}