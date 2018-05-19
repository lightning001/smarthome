package com.example.josephpham.apbar

import android.support.v7.widget.RecyclerView
import android.view.LayoutInflater
import android.view.ViewGroup
import android.widget.LinearLayout


class PuppyAdapter(private val puppies: ArrayList<Puppy>) : RecyclerView.Adapter<PuppyHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): PuppyHolder {
        val puppyItem = LayoutInflater.from(parent.context).inflate(R.layout.puppy_item, parent, false) as LinearLayout
        return PuppyHolder(puppyItem)
    }

    override fun onBindViewHolder(holder: PuppyHolder, position: Int) {
        holder.updateWithPuppy(puppies[position])
    }

    override fun getItemCount(): Int {
        return puppies.toArray().count();
    }

}