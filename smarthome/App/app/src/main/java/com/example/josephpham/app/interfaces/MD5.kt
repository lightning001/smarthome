package com.example.josephpham.app.interfaces

import java.security.NoSuchAlgorithmException



interface MD5 {
    fun md5(s: String): String {
        try {
            // Create MD5 Hash
            val digest = java.security.MessageDigest.getInstance("MD5")
            digest.update(s.toByteArray())
            val messageDigest = digest.digest()

            // Create Hex String
            val hexString = StringBuffer()
            for (i in messageDigest.indices)
                hexString.append(Integer.toHexString(0xFF and messageDigest[i].toInt()))

            return hexString.toString()
        } catch (e: NoSuchAlgorithmException) {
            e.printStackTrace()
        }

        return ""
    }
}