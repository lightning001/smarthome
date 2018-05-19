package com.example.josephpham.apbar

import android.content.Context
import android.support.v4.app.Fragment
import android.support.v4.app.FragmentManager
import android.support.v4.app.FragmentPagerAdapter

class PageAdapter(fm: FragmentManager, private val context: Context) : FragmentPagerAdapter(fm) {

    override fun getItem(position: Int): Fragment {
        when (position) {
            0 -> return PuppyListFragment.newInstance(PuppyListType.All, context)
            1 -> return PuppyListFragment.newInstance(PuppyListType.Big, context)
            2 -> return PuppyListFragment.newInstance(PuppyListType.Small, context)
            3 -> return PuppyListFragment.newInstance(PuppyListType.LeashTrained, context)
            4 -> return PuppyListFragment.newInstance(PuppyListType.Active, context)
        }
        return PuppyListFragment.newInstance(PuppyListType.All, context)
    }

    override fun getCount(): Int {
        // Show 5 total pages.
        return 5
    }

    override fun getPageTitle(position: Int): CharSequence? {
        // return null to show no title.
        return null

    }

}