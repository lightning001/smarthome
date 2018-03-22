package com.example.josephpham.smarthome.fragments


import android.annotation.SuppressLint
import android.app.Activity
import android.os.Bundle
import android.support.design.widget.Snackbar
import android.support.v4.app.Fragment
import android.support.v7.widget.LinearLayoutManager
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup

import com.example.josephpham.smarthome.R
import com.example.josephpham.smarthome.adapter.ModeAdapter
import com.example.josephpham.smarthome.model.Mode
import kotlinx.android.synthetic.main.fragment_mode.*
import java.util.*


@SuppressLint("ValidFragment")
class Mode : Fragment {
    var arr : ArrayList<Mode> = ArrayList()
    var adapter : ModeAdapter? = null
    var activity: Activity? = null
    constructor(activity: Activity){
        this.activity = activity
    }

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_mode, container, false)
    }
    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
        arr.add(Mode(0,"di lam",0,1, Calendar.getInstance().getTime(), Calendar.getInstance().getTime()))
        arr.add(Mode(0,"di lam",0,1, Calendar.getInstance().getTime(), Calendar.getInstance().getTime()))
        arr.add(Mode(0,"di lam",0,1, Calendar.getInstance().getTime(), Calendar.getInstance().getTime()))
        arr.add(Mode(0,"di lam",0,1, Calendar.getInstance().getTime(), Calendar.getInstance().getTime()))
        arr.add(Mode(0,"di lam",0,1, Calendar.getInstance().getTime(), Calendar.getInstance().getTime()))

        if (activity != null){
            modeList.layoutManager = LinearLayoutManager(activity)
            modeList.setHasFixedSize(true)
            adapter = ModeAdapter(activity!!, arr)
            modeList.adapter = adapter //ukm
            fab.setOnClickListener { view ->
                Snackbar.make(view, "Replace with your own action", Snackbar.LENGTH_LONG).setAction("Action", null).show()
            }
        }
    }


}
