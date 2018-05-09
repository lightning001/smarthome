package com.example.josephpham.app.activity

import android.content.Intent
import android.os.Bundle
import android.support.design.widget.NavigationView
import android.support.v4.view.GravityCompat
import android.support.v7.app.ActionBarDrawerToggle
import android.support.v7.app.AppCompatActivity
import android.util.Log
import android.view.*
import android.widget.TextView
import android.widget.Toast
import com.example.josephpham.app.R
import com.example.josephpham.app.adapter.RoomAdapter
import com.example.josephpham.app.model.DeviceInRoom
import com.example.josephpham.app.model.Room
import com.example.josephpham.app.model.User
import com.squareup.picasso.Picasso
import de.hdodenhof.circleimageview.CircleImageView
import io.socket.client.Socket
import io.socket.emitter.Emitter
import kotlinx.android.synthetic.main.activity_main.*
import kotlinx.android.synthetic.main.app_bar_main.*
import kotlinx.android.synthetic.main.content_main.*
import org.json.JSONException
import org.json.JSONObject
import kotlin.collections.ArrayList


class MainActivity : AppCompatActivity(), NavigationView.OnNavigationItemSelectedListener {
    companion object {
        var user: User = LoginActivity.user
        var adapter : RoomAdapter? = null
        //    var user: User? = null
        var mSocket: Socket = LoginActivity.msocket
        //        var mSocket: Socket = Connect.connect()
        var listDeviceInRoom: ArrayList<DeviceInRoom>?  = null
        var listDeviceNotRoom: ArrayList<DeviceInRoom>?  = null
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        setSupportActionBar(toolbar)
        fab.setOnClickListener { view ->
            mSocket.emit("deviceUnused", user.id)
            mSocket.on("deviceUnusedResult", onretrieveDataDeviceUnused)
        }
        customHeadđer()
        addControll()
    }
    //custom headder nagative
    fun  customHeadđer(){
        val toggle = ActionBarDrawerToggle(
                this, drawer_layout, toolbar, R.string.navigation_drawer_open, R.string.navigation_drawer_close)
        drawer_layout.addDrawerListener(toggle)
        toggle.syncState()
        nav_view.setNavigationItemSelectedListener(this)
        val header = nav_view.getHeaderView(0)
        if(user?.img == null){
            var img = header.findViewById(R.id.imageView) as CircleImageView
            img.setImageResource(R.drawable.profile)
            var tvname = header.findViewById(R.id.tvname) as TextView
            var tvemail = header.findViewById(R.id.tvemail) as TextView
            tvname.setText("josephpham")
            tvemail.setText("josephpham1996")
        }else {
            Picasso.get().load(user.img).into(header.findViewById(R.id.imageView) as CircleImageView)
            var tvname = header.findViewById(R.id.tvname) as TextView
            var tvemail = header.findViewById(R.id.tvemail) as TextView
            tvname.setText(user.name)
            tvemail.setText(user.email)
        }

    }
    fun addControll() {
        var listRoom: ArrayList<Room> = user.listRoom

        adapter = RoomAdapter(this@MainActivity, listRoom)
        room.adapter = adapter
        room.setOnItemClickListener { adapterView, view, i, l ->
            mSocket.emit("deviceInRoom", listRoom.get(i).id)
            mSocket.on("deviceInRoomResult", onretrieveDataDeviceInRoom)
            Toast.makeText(this@MainActivity, listRoom.get(i).room, Toast.LENGTH_LONG).show()
        }
    }

    override fun onBackPressed() {
        if (drawer_layout.isDrawerOpen(GravityCompat.START)) {
            drawer_layout.closeDrawer(GravityCompat.START)
        } else {
            super.onBackPressed()
        }
    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        // Inflate the menu; this adds items to the action bar if it is present.
        menuInflater.inflate(R.menu.main, menu)
        return true
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        when (item.itemId) {
            R.id.action_settings -> return true
            else -> return super.onOptionsItemSelected(item)
        }
    }

    override fun onNavigationItemSelected(item: MenuItem): Boolean {
        // Handle navigation view item clicks here.
        when (item.itemId) {
            R.id.nav_camera -> {
            }
            R.id.profile -> {
                val intent = Intent(this@MainActivity, UserActivity::class.java)
                startActivity(intent)
            }

            R.id.setting -> {

            }
            R.id.nav_share -> {

            }
            R.id.nav_send -> {

            }
        }

        drawer_layout.closeDrawer(GravityCompat.START)
        return true
    }
    var onretrieveDataDeviceInRoom: Emitter.Listener = Emitter.Listener { args ->
        runOnUiThread {
            val data1 = args[0] as JSONObject
            try {
                var correct = data1.getBoolean("error")
                if(correct != true) {
                    listDeviceInRoom = ArrayList<DeviceInRoom>()
                    var roomJson = data1.getJSONArray("Result")
                    for (i in 0.. roomJson.length()-1){
                        var dataRoom: JSONObject = roomJson.getJSONObject(i)
                        Log.d("HHHH", dataRoom.toString())
                        val deviceinroom = DeviceInRoom.parseJson(dataRoom)
                        listDeviceInRoom?.add(deviceinroom)
                        Log.d("mmmm", listDeviceInRoom.toString())
                    }
//                    val listMode = user.listMode
                    val intent: Intent = Intent(this@MainActivity, Main2Activity::class.java)
                    startActivity(intent)
                }else{
                    val err = data1.getString("Result")
                    Toast.makeText(this, err.toString(), Toast.LENGTH_LONG).show()
                }
            } catch (e: JSONException) {
                Log.d("DeviceInRoom", e.toString())
            }
        }
    }
    var onretrieveDataDeviceUnused: Emitter.Listener = Emitter.Listener { args ->
        runOnUiThread {
            val data1 = args[0] as JSONObject
            try {
                var correct = data1.getBoolean("error")
                if(correct != true) {
                    listDeviceNotRoom = ArrayList<DeviceInRoom>()
                    var roomJson = data1.getJSONArray("Result")
                    for (i in 0.. roomJson.length()-1){
                        var dataRoom: JSONObject = roomJson.getJSONObject(i)
                        val deviceinroom = DeviceInRoom.parseJson(dataRoom)
                        listDeviceNotRoom!!.add(deviceinroom)
                    }
                    val intent: Intent = Intent(this@MainActivity, AddRoomActivity::class.java)
                    startActivity(intent)

                }else{
                    val err = data1.getString("Result")
                    Toast.makeText(this, err.toString(), Toast.LENGTH_LONG).show()
                }
            } catch (e: JSONException) {
                Log.d("EEEE", e.toString())
            }
        }
    }
}
