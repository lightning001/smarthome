package com.example.josephpham.app.frament

import android.annotation.SuppressLint
import android.os.Bundle
import android.os.Parcel
import android.os.Parcelable
import android.support.v4.app.Fragment
import android.support.v4.content.ContextCompat
import android.support.v7.widget.DividerItemDecoration
import android.support.v7.widget.LinearLayoutManager
import android.support.v7.widget.RecyclerView
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.example.josephpham.app.R
import com.example.josephpham.app.activity.LoginActivity
import com.example.josephpham.app.activity.Main2Activity
import com.example.josephpham.app.activity.MainActivity
import com.example.josephpham.app.adapter.ModeAdapter
import com.example.josephpham.app.model.Mode
import java.io.Serializable
import kotlin.collections.ArrayList

class Tab_Mode : Fragment(){

    var listmode = MainActivity.user!!.listMode

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?,
                              savedInstanceState: Bundle?): View? {
        val v = inflater.inflate(R.layout.fragment_mode, container, false)
        val recyclerView = v.findViewById(R.id.modeList) as RecyclerView
        recyclerView.setHasFixedSize(true)
        recyclerView.layoutManager = LinearLayoutManager(context)
        val dividerItemDecoration = DividerItemDecoration(recyclerView.context, DividerItemDecoration.VERTICAL)
        val drawable = ContextCompat.getDrawable(requireActivity(), R.drawable.customdiliver)
        dividerItemDecoration.setDrawable(drawable!!)
        recyclerView.addItemDecoration(dividerItemDecoration)
        val adapter = ModeAdapter(listmode)
        recyclerView.adapter = adapter
        return v
    }

}