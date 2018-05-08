package com.example.josephpham.app.interfaces

import android.util.Base64
import android.util.Base64.URL_SAFE
import android.util.Log
import io.socket.utf8.UTF8
import java.io.UnsupportedEncodingException


interface JWTUtils {
    var keytoken: String
    @Throws(Exception::class)
    fun decoded(JWTEncoded: String): String {
        try {
            val split = JWTEncoded.split("\\.".toRegex()).dropLastWhile { it.isEmpty() }.toTypedArray()
            Log.d("JWT_DECODED", "Header: " + getJson(split[0]))
            Log.d("JWT_DECODED", "Body: " + getJson(split[1]))
            Log.d("JWT_DECODED", "Signature" + getJson(split[2]))
            keytoken = getJson(split[2])
            return getJson(split[1])
        } catch (e: UnsupportedEncodingException) {
            //Error
        }
        return ""

    }

    @Throws(UnsupportedEncodingException::class)
    private fun getJson(strEncoded: String): String {
        val decodedBytes = Base64.decode(strEncoded, Base64.URL_SAFE)
        return String(decodedBytes)
    }
}