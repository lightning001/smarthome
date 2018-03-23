package com.example.josephpham.smarthome

import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.support.v4.view.MenuItemCompat
import android.view.Menu
import android.view.MenuItem
import android.widget.Toast
import com.example.josephpham.smarthome.adapter.PageAdapters
import com.example.josephpham.smarthome.fragments.Camera
import com.example.josephpham.smarthome.fragments.Device
import com.example.josephpham.smarthome.fragments.Mode
import kotlinx.android.synthetic.main.activity_second.*
import kotlinx.android.synthetic.main.toolbar.*

class SecondActivity : AppCompatActivity() {
    var pageAdapter : PageAdapters? = null
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.toolbar)
        setSupportActionBar(toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)

        pageAdapter = PageAdapters(supportFragmentManager)
        pageAdapter!!.addFragment(Device(this@SecondActivity), "Device")
        pageAdapter!!.addFragment(Mode(this@SecondActivity), "Mode")
        pageAdapter!!.addFragment(Camera(), "Camera")
        costomViewPager.adapter = pageAdapter
        costomTablayout.setupWithViewPager(costomViewPager)

    }

    override fun onCreateOptionsMenu(menu: Menu?): Boolean {
        getMenuInflater().inflate(R.menu.menu_main, menu)
        var searchItem = menu?.findItem(R.id.action_search);
        var searchView = MenuItemCompat.getActionView(searchItem)
        return super.onCreateOptionsMenu(menu)
    }

    override fun onOptionsItemSelected(item: MenuItem?): Boolean {
        val id: Int = item!!.itemId
        if (id == R.id.action_settings){
            Toast.makeText(this,R.string.action_settings,Toast.LENGTH_SHORT).show()
        }
        if (id == R.id.action_settings){
            Toast.makeText(this,R.string.action_settings,Toast.LENGTH_SHORT).show()
        }

        return super.onOptionsItemSelected(item)
    }
}
