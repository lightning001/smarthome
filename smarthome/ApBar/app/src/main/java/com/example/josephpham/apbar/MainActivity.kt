package com.example.josephpham.apbar


import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.support.design.widget.TabLayout
import android.support.v4.view.ViewPager
import android.support.v7.widget.Toolbar
import android.view.View


class MainActivity : AppCompatActivity() {

    private var mSectionsPagerAdapter: PageAdapter? = null

    /**
     * The [ViewPager] that will host the section contents.
     */
    private var mViewPager: ViewPager? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

//        val toolbar = findViewById<View>(R.id.toolbar) as Toolbar
//        setSupportActionBar(toolbar)

        // Create the adapter that will return a fragment for each of the three
        // primary sections of the activity.
        mSectionsPagerAdapter = PageAdapter(supportFragmentManager, this)

        // Set up the ViewPager with the sections adapter.
        mViewPager = findViewById<ViewPager?>(R.id.container)
        mViewPager!!.adapter = mSectionsPagerAdapter

        val tabLayout = findViewById<View>(R.id.tabs) as TabLayout
        tabLayout.setupWithViewPager(mViewPager)

        // set icons
        tabLayout.getTabAt(0)!!.setIcon(R.drawable.ic_home_white_24dp)
        tabLayout.getTabAt(1)!!.setIcon(R.drawable.ic_dog_white_24dp)
        tabLayout.getTabAt(2)!!.setIcon(R.drawable.ic_small_dog_white_24dp)
        tabLayout.getTabAt(3)!!.setIcon(R.drawable.ic_trained_white_24dp)
        tabLayout.getTabAt(4)!!.setIcon(R.drawable.ic_active_white_24dp)

    }
}
