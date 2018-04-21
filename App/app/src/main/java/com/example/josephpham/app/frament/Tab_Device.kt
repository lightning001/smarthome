package com.example.josephpham.app.frament

import android.annotation.SuppressLint
import android.app.Activity
import android.os.Bundle
import android.support.design.widget.Snackbar
import android.support.v4.app.Fragment
import android.support.v4.app.FragmentActivity
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import com.example.josephpham.app.R
import com.example.josephpham.app.R.layout.fragment_device
import com.example.josephpham.app.activity.Main2Activity
import com.example.josephpham.app.activity.MainActivity
import com.example.josephpham.app.adapter.DeviceAdapter
import com.example.josephpham.app.model.Device
import com.example.josephpham.app.model.DeviceInRoom
import kotlinx.android.synthetic.main.fragment_device.*
import kotlinx.android.synthetic.main.fragment_device.view.*

class Tab_Device: Fragment() {
    var listDeviceInRoom  = MainActivity.listDeviceInRoom
    var adapter : DeviceAdapter? = null
    var activity: Activity? = null
//    constructor(arr: ArrayList<DeviceInRoom>){
//        this.arr = arr
//    }

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?,
                              savedInstanceState: Bundle?): View? {
        val rootView = inflater.inflate(R.layout.fragment_device, container, false)
        return rootView
    }
    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
        activity = getActivity()
        if (activity != null){
//            adapter = DeviceAdapter(arr.createDevice(), activity as FragmentActivity)
            adapter = DeviceAdapter(listDeviceInRoom!!, activity as FragmentActivity)
            device.adapter = adapter //ukm
        }
    }

}