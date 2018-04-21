package com.example.josephpham.app.activity

import android.content.Context
import android.content.DialogInterface
import android.content.Intent
import android.support.v7.app.AppCompatActivity
import android.support.v4.app.Fragment
import android.support.v4.app.FragmentManager
import android.support.v4.app.FragmentPagerAdapter
import android.os.Bundle
import android.support.v4.view.ViewPager
import android.support.v7.app.AlertDialog
import android.support.v7.widget.LinearLayoutManager
import android.support.v7.widget.RecyclerView
import android.support.v7.widget.Toolbar
import android.util.Log
import android.view.LayoutInflater
import android.view.Menu
import android.view.MenuItem
import android.view.View
import android.view.animation.AnimationUtils
import android.widget.ListView
import android.widget.Toast

import com.example.josephpham.app.R
import com.example.josephpham.app.adapter.ListDeviceAdapter
import com.example.josephpham.app.adapter.ModeAdapter
import com.example.josephpham.app.connect.Connect
import com.example.josephpham.app.frament.*
import com.example.josephpham.app.model.DeviceInRoom
import com.example.josephpham.app.model.Mode
import io.socket.client.Socket
import io.socket.emitter.Emitter
import kotlinx.android.synthetic.main.activity_main2.*
import kotlinx.android.synthetic.main.fablayout.*
import org.json.JSONException
import org.json.JSONObject

class Main2Activity : AppCompatActivity() {

    /**
     * The [android.support.v4.view.PagerAdapter] that will provide
     * fragments for each of the sections. We use a
     * {@link FragmentPagerAdapter} derivative, which will keep every
     * loaded fragment in memory. If this becomes too memory intensive, it
     * may be best to switch to a
     * [android.support.v4.app.FragmentStatePagerAdapter].\
     */
    companion object {
        var listAllDevice: ArrayList<DeviceInRoom>? = null
        var mSocket = LoginActivity.msocket
        var idUsser = LoginActivity.user.id
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main2)
        setSupportActionBar(toolbar2)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        initToolbar()

//        val bundle = intent.getExtras()
//        listmode  = bundle.getSerializable("listmode") as ArrayList<Mode>
//        listDeviceInRoom  = bundle.getSerializable("listDeviceInRoom") as ArrayList<DeviceInRoom>
//        Log.d("listdevice", listDeviceInRoom.toString())


        val mHideButton = AnimationUtils.loadAnimation(this, R.anim.hide_button)
        val mShowButton = AnimationUtils.loadAnimation(this, R.anim.show_button)
        val mHideLayout = AnimationUtils.loadAnimation(this, R.anim.hide_layout)
        val mShowLayout = AnimationUtils.loadAnimation(this, R.anim.show_layout)
        initViews()
        fab2.setOnClickListener { view ->
            if(adddevicelayout.visibility == View.VISIBLE &&
                    addmodelayout.visibility == View.VISIBLE){
                adddevicelayout.visibility = View.GONE
                addmodelayout.visibility = View.GONE
                adddevicelayout.startAnimation(mHideLayout)
                addmodelayout.startAnimation(mHideLayout)
                fab2.startAnimation(mHideButton)
            }else{
                adddevicelayout.visibility = View.VISIBLE
                addmodelayout.visibility = View.VISIBLE
                adddevicelayout.startAnimation(mShowLayout)
                addmodelayout.startAnimation(mShowLayout)
                fab2.startAnimation(mShowButton)
            }

        }
        adddevice.setOnClickListener { view ->
            openDialog(view)

        }
        addmode.setOnClickListener { view ->
            mSocket.emit("allDevice", idUsser)
            mSocket.on("allDeviceResult", onretrieveDataAllDevice)
        }
        tabLayout.setupWithViewPager(view_pager)
        tabLayout.getTabAt(0)!!.setIcon(R.drawable.ic_room_key)
        tabLayout.getTabAt(1)!!.setIcon(R.drawable.ic_mode)
        tabLayout.getTabAt(2)!!.setIcon(R.drawable.ic_camera_alt_black_24dp)
//        listmode.add(Mode("1", "dilam1",true,1324, 1341))
//        listmode.add(Mode("1", "dilam2",true,541, 1300))
//        listmode.add(Mode("1", "dilam3",false,100, 431))
//        listmode.add(Mode("1", "dilam4",true,741, 1000))



    }
    fun openDialog(v: View){
        val mBuilder = AlertDialog.Builder(this@Main2Activity)
        val inflater : LayoutInflater = this.getSystemService(Context.LAYOUT_INFLATER_SERVICE) as LayoutInflater
        val row : View = inflater.inflate(R.layout.item_device, null)
        val recyclerView = row.findViewById(R.id.listdeivce) as RecyclerView
        recyclerView.setHasFixedSize(true)
        recyclerView.layoutManager = LinearLayoutManager(this@Main2Activity)
        val adapter = ListDeviceAdapter()
        recyclerView.adapter = adapter

        mBuilder.setView(recyclerView)
        val dialog = mBuilder.create()
        dialog.setTitle("list device can add this room")
        dialog.show()
    }
    private fun initToolbar() {
        val toolbar = findViewById<View>(R.id.toolbar2) as Toolbar
        setSupportActionBar(toolbar)
        supportActionBar!!.setDisplayHomeAsUpEnabled(true)
    }

    private fun initViews() {
        val viewPager = findViewById<View>(R.id.view_pager) as ViewPager
        viewPager.adapter = MainPagerAdapter(supportFragmentManager)
    }
    inner class MainPagerAdapter(fm: FragmentManager) : FragmentPagerAdapter(fm) {
        override fun getItem(position: Int): Fragment? {
            when (position) {
                0 -> {
                    val tab1 = Tab_Device()
                    return tab1 as Fragment
                }
                1 -> {
                    val tab2 = Tab_Mode()
                    return tab2 as Fragment
                }
                2 -> {
                    val tab3 = Tab_Camera()
                    return tab3 as Fragment
                }

            }
            return Tab_Device()
        }

        override fun getCount(): Int {
            return 3
        }
    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        // Inflate the menu; this adds items to the action bar if it is present.
        menuInflater.inflate(R.menu.menu_main2, menu)
        return true
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        val id = item.itemId

        if (id == R.id.action_settings) {
            return true
        }

        return super.onOptionsItemSelected(item)
    }
    var onretrieveDataAllDevice: Emitter.Listener = Emitter.Listener { args ->
        runOnUiThread {
            val data1 = args[0] as JSONObject
            try {
                var correct = data1.getBoolean("error")
                if(correct != true) {
                    MainActivity.listDeviceNotRoom = ArrayList<DeviceInRoom>()
                    var roomJson = data1.getJSONArray("Result")
                    for (i in 0.. roomJson.length()-1){
                        var dataDevice: JSONObject = roomJson.getJSONObject(i)
                        val allDevice = DeviceInRoom.parseJson(dataDevice)
                        listAllDevice!!.add(allDevice)
                    }
                    Log.d("listAllDevice", listAllDevice.toString())
                    val intent: Intent = Intent(this@Main2Activity, AddRoomActivity::class.java)
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

