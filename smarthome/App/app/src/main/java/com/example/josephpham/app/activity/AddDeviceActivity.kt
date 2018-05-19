package com.example.josephpham.app.activity

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.support.v4.content.LocalBroadcastManager
import android.support.v7.widget.LinearLayoutManager
import com.example.josephpham.app.R
import com.example.josephpham.app.adapter.AddDeviceAdapter
import com.example.josephpham.app.model.Device
import kotlinx.android.synthetic.main.activity_add_device.*
import kotlin.collections.ArrayList
import android.util.Log
import android.widget.Toast
import com.squareup.picasso.Picasso


class AddDeviceActivity : AppCompatActivity(){


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_add_device)
        setSupportActionBar(toolbar_add_device)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        controll()
        LocalBroadcastManager.getInstance(this).registerReceiver(mMessageReceiver,
                 IntentFilter("custom-message"));
    }
    private fun controll() {
        var list: ArrayList<Device> = ArrayList()
        list.add(Device("1", "bóng đèn", "https://scontent.fsgn2-1.fna.fbcdn.net/v/t1.0-9/13428509_623771871120998_7085848076689449338_n.jpg?_nc_cat=0&_nc_eui2=v1%3AAeFsKNT70bUY_hQ1tNAJhY6Ggjjyv4IIfYsmO6r64YZoInNmnUQJQI3FpScvxhxLl4lI5N-TmF6QX-bRATTATTQSb3ydt86DBRbbiQ8a4ptHXg&oh=c979f6539c941446191d4554de030ee6&oe=5B8AADF2", "đèn sáng", 21000.0, 1))
        list.add(Device("1", "quạt", "https://scontent.fsgn2-1.fna.fbcdn.net/v/t1.0-9/13428509_623771871120998_7085848076689449338_n.jpg?_nc_cat=0&_nc_eui2=v1%3AAeFsKNT70bUY_hQ1tNAJhY6Ggjjyv4IIfYsmO6r64YZoInNmnUQJQI3FpScvxhxLl4lI5N-TmF6QX-bRATTATTQSb3ydt86DBRbbiQ8a4ptHXg&oh=c979f6539c941446191d4554de030ee6&oe=5B8AADF2", "đèn sáng", 21000.0, 1))
        list.add(Device("1", "máy giặc", "https://scontent.fsgn2-1.fna.fbcdn.net/v/t1.0-9/31706461_998650070299841_1624526119346634752_n.jpg?_nc_cat=0&_nc_eui2=v1%3AAeEz06XSJZ84VZ9NJhnZhl6uzFa86TstrE53KPCMB7euGdTNRNpsCytU2R3DiDB42hrVz_OdeyExraaDU3uYbIu13TriCDnqwH8rj6FZeWaaNw&oh=3b059cbb95153443ca0751239e08cabf&oe=5B59DF00", "đèn sáng", 21000.0, 1))
        list.add(Device("1", "máy lạnh", "https://scontent.fsgn2-1.fna.fbcdn.net/v/t1.0-9/31706461_998650070299841_1624526119346634752_n.jpg?_nc_cat=0&_nc_eui2=v1%3AAeEz06XSJZ84VZ9NJhnZhl6uzFa86TstrE53KPCMB7euGdTNRNpsCytU2R3DiDB42hrVz_OdeyExraaDU3uYbIu13TriCDnqwH8rj6FZeWaaNw&oh=3b059cbb95153443ca0751239e08cabf&oe=5B59DF00", "đèn sáng", 21000.0, 1))
        list.add(Device("1", "tủ lạnh", "https://scontent.fsgn2-1.fna.fbcdn.net/v/t1.0-9/31706461_998650070299841_1624526119346634752_n.jpg?_nc_cat=0&_nc_eui2=v1%3AAeEz06XSJZ84VZ9NJhnZhl6uzFa86TstrE53KPCMB7euGdTNRNpsCytU2R3DiDB42hrVz_OdeyExraaDU3uYbIu13TriCDnqwH8rj6FZeWaaNw&oh=3b059cbb95153443ca0751239e08cabf&oe=5B59DF00", "đèn sáng", 21000.0, 1))
        list.add(Device("1", "tivi", "https://scontent.fsgn2-1.fna.fbcdn.net/v/t1.0-9/29025740_969299196568262_4611680306120884224_n.jpg?_nc_cat=0&_nc_eui2=v1%3AAeGhPlJz8-LTljhpCEgoK2-Ddo2xTVZFA7IGi1BC2UcjhSTa-KhFjOwdALQ3DL3WSF9gt9MaDBYkWWCxaDn1hachM_BhD9AAb4xkLrsWYD8tjw&oh=6707b85975c1907d5f551078ef2dffc1&oe=5B9A5B78", "đèn sáng", 21000.0, 1))
        list.add(Device("1", "bóng đèn dài", "https://scontent.fsgn2-1.fna.fbcdn.net/v/t1.0-9/29025740_969299196568262_4611680306120884224_n.jpg?_nc_cat=0&_nc_eui2=v1%3AAeGhPlJz8-LTljhpCEgoK2-Ddo2xTVZFA7IGi1BC2UcjhSTa-KhFjOwdALQ3DL3WSF9gt9MaDBYkWWCxaDn1hachM_BhD9AAb4xkLrsWYD8tjw&oh=6707b85975c1907d5f551078ef2dffc1&oe=5B9A5B78", "đèn sáng", 21000.0, 1))
        list_type_device.layoutManager = LinearLayoutManager(this@AddDeviceActivity, LinearLayoutManager.HORIZONTAL, false)
        val adapter = AddDeviceAdapter(this@AddDeviceActivity, list)
        list_type_device.adapter = adapter
    }

    var mMessageReceiver: BroadcastReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context, intent: Intent) {
            // Get extra data included in the Intent
            val itemName = intent.getStringExtra("name")
            val itemimg = intent.getStringExtra("img")
            val itemprice = intent.getStringExtra("price")
            Picasso.get().load(itemimg).into(img_type_device)
            tv_price.setText(itemprice)
            Toast.makeText(this@AddDeviceActivity, itemName , Toast.LENGTH_SHORT).show()
        }
    }

}
