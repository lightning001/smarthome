package com.example.josephpham.app.activity

import android.content.Intent
import android.os.AsyncTask
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
import com.example.josephpham.app.model.Room
import com.example.josephpham.app.model.User
import com.example.josephpham.smarthome.sqlite.DatabaseHandler
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


class MainActivity() : AppCompatActivity(), NavigationView.OnNavigationItemSelectedListener {

    companion object {
        var token: String = ""
        var adapter : RoomAdapter? = null
        var mSocket: Socket = LoginActivity.msocket
        var user = User()
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        setSupportActionBar(toolbar)
        thucthi().execute()


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
            R.id.action_list_device -> {

            }
            R.id.action_add_device ->{
                val intent = Intent(this@MainActivity, AddDeviceActivity::class.java)
//                intent.putExtra("id_user", user.id)
                startActivity(intent)
            }
        }
        return true

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


    var onretrieveDataUser: Emitter.Listener = Emitter.Listener { args ->
        runOnUiThread {
            val data = args[0] as JSONObject
            try {
                var correct = data.getBoolean("success")
                if (correct == true) {
                    var result = data.getJSONObject("result")
                    Log.d("CCCC", result.toString())
                    user = User.parseJson(result)
                    Log.d("CCCC", user.toString())
                    fab.setOnClickListener { view ->
                        val intent: Intent = Intent(this@MainActivity, AddRoomActivity::class.java)
                        startActivity(intent)
                    }
                    customHeadđer()
                    addControll()
                } else {
                    val err = data.getString("message")
                    Toast.makeText(this, err.toString(), Toast.LENGTH_LONG).show()
                }
            } catch (e: JSONException) {
                Log.d("EEEE", e.toString())
            }
        }
    }
    //custom headder nagative
    fun  customHeadđer(){
        val toggle = ActionBarDrawerToggle(
                this, drawer_layout, toolbar, R.string.navigation_drawer_open, R.string.navigation_drawer_close)
        drawer_layout.addDrawerListener(toggle)
        toggle.syncState()
        nav_view.setNavigationItemSelectedListener(this)
        val header = nav_view.getHeaderView(0)
        if(user.img == null || user.img.isEmpty()){
            var img = header.findViewById(R.id.imageView) as CircleImageView
            img.setImageResource(R.drawable.profile)
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
            val intent: Intent = Intent(this@MainActivity, Main2Activity::class.java)
            intent.putExtra("id_room", listRoom.get(i).id)
            intent.putExtra("id_user", user.id)
            startActivity(intent)
            Toast.makeText(this@MainActivity, listRoom.get(i).room, Toast.LENGTH_LONG).show()
        }
    }
    inner class thucthi: AsyncTask<Void, Void, Boolean>() {


        override fun doInBackground(vararg params: Void): Boolean? {
            var db = DatabaseHandler(this@MainActivity)
            token = db.readData()
            var check = false
            if(token.equals("")){
                check = false
                Log.d("AAAA", "sai")
            }else{
                check = true
                Log.d("AAAA", "dung")
            }
            return check
        }
        override fun onPostExecute(result: Boolean?){
            super.onPostExecute(result)
            if (result == false){
                val intent = Intent(this@MainActivity, LoginActivity::class.java)
                startActivity(intent)
            }else{
                mSocket.emit("client_send_data_user", token)
                mSocket.on("server_send_data_user", onretrieveDataUser)
            }
        }
    }
}
