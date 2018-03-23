package com.example.josephpham.smarthome.adapter

import android.support.v4.app.Fragment
import android.support.v4.app.FragmentManager
import android.support.v4.app.FragmentPagerAdapter

class PageAdapters(fm: FragmentManager?) : FragmentPagerAdapter(fm) {

    var mfm = fm
    var mfragmentItem: ArrayList<Fragment> = ArrayList()
    var mfragmentTitle: ArrayList<String> = ArrayList()

    fun addFragment(fragmentitem: Fragment, fragmentTitle: String){
        mfragmentItem.add(fragmentitem)
        mfragmentTitle.add(fragmentTitle)
    }
    override fun getItem(position: Int): Fragment {
        return mfragmentItem.get(position)
    }

    override fun getCount(): Int {
        return mfragmentItem.size
    }

    override fun getPageTitle(position: Int): CharSequence {
        return mfragmentTitle[position]
    }
}