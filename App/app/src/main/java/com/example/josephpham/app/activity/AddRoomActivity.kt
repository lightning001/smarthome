package com.example.josephpham.app.activity

import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.support.v7.widget.LinearLayoutManager
import android.support.v7.widget.Toolbar
import android.util.Log
import com.example.josephpham.app.R
import android.view.View
import com.example.josephpham.app.adapter.AddRoomAdapter
import com.example.josephpham.app.model.DeviceInRoom
import kotlinx.android.synthetic.main.activity_add_room.*


class AddRoomActivity : AppCompatActivity() {
    var listDevice = MainActivity.listDeviceNotRoom

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_add_room)
        val toolbar = findViewById<View>(R.id.toolbar4) as Toolbar
        setSupportActionBar(toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)

        list_device.layoutManager = LinearLayoutManager(this@AddRoomActivity, LinearLayoutManager.HORIZONTAL, false)
        val adapter = AddRoomAdapter( this@AddRoomActivity)
        list_device.adapter = adapter
    }
}
