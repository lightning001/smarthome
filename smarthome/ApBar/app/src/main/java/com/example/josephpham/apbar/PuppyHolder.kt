package com.example.josephpham.apbar

import android.widget.ImageView
import android.widget.TextView
import android.support.v7.widget.RecyclerView
import android.view.View


/**
 * Created by adunn on 7/5/17.
 */
class PuppyHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
    private val puppyImage: ImageView = itemView.findViewById<ImageView>(R.id.puppyImageView)
    private val puppyName: TextView = itemView.findViewById(R.id.puppyTextView)

    fun updateWithPuppy(puppy: Puppy) {
        puppyImage.setImageDrawable(puppy.imageFile)
        puppyName.text = puppy.name
    }

}