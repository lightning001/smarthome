package com.example.josephpham.smarthome.fragments


import android.annotation.SuppressLint
import android.app.Activity
import android.os.Bundle
import android.support.design.widget.Snackbar
import android.support.v4.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup

import com.example.josephpham.smarthome.R
import com.example.josephpham.smarthome.adapter.DeviceAdapter
import com.example.josephpham.smarthome.model.Mode
import kotlinx.android.synthetic.main.fragment_device.*

@SuppressLint("ValidFragment")
class Device : Fragment{
    var arr : ArrayList<Mode> = ArrayList()
    var adapter : DeviceAdapter? = null
    var activity: Activity? = null
    constructor(activity: Activity){
        this.activity = activity
    }

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_device, container, false)
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
        arr.add(Mode(0,"device1", 0, 0))
        arr.add(Mode(0,"device2", 0, 1))
        arr.add(Mode(0,"device3", 0, 0))
        arr.add(Mode(0,"device4", 0, 1))
        arr.add(Mode(0,"device5", 0, 0))
        arr.add(Mode(0,"device6", 0, 1))
        arr.add(Mode(0,"device7", 0, 1))
        arr.add(Mode(0,"device8", 0, 0))
        arr.add(Mode(0,"device9", 0, 1))
        if (activity != null){
            adapter = DeviceAdapter(activity!!, arr)
            list_device.adapter = adapter //ukm
            fab1.setOnClickListener { view ->
                Snackbar.make(view, "Replace with your own action", Snackbar.LENGTH_LONG).setAction("Action", null).show()
            }
        }
    }

}
