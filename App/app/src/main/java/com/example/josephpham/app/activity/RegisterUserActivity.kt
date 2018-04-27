package com.example.josephpham.app.activity

import android.app.Activity
import android.app.DatePickerDialog
import android.app.DatePickerDialog.OnDateSetListener
import android.content.Intent
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.text.TextUtils
import android.view.View
import com.example.josephpham.app.R
import kotlinx.android.synthetic.main.activity_register_user.*
import org.json.JSONObject
import java.security.NoSuchAlgorithmException
import java.text.SimpleDateFormat
import java.util.*
import android.graphics.Bitmap
import android.provider.MediaStore
import java.io.ByteArrayOutputStream


class RegisterUserActivity : AppCompatActivity() {

    var mSocket = LoginActivity.msocket
    var dob = Date()
    val REQUEST_TAKE_PICTURE = 123
    var bitmap: Bitmap? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_register_user)
        event()

    }
    fun event(){
        tvbirthday.setOnClickListener {
            dob = dataPickerDialog() as Date
        }
        imgsel.setOnClickListener {
            takePicture()

        }
        register.setOnClickListener {
            attemptRegister()
        }

    }

    fun takePicture(){
        val intent: Intent  = Intent(MediaStore.ACTION_IMAGE_CAPTURE)
        startActivityForResult(intent, REQUEST_TAKE_PICTURE)
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        if (requestCode == REQUEST_TAKE_PICTURE && resultCode == Activity.RESULT_OK){
            bitmap = data!!.extras.get("data") as Bitmap
            bitmap = resize(bitmap!!, 200,200)
            imgprofile.setImageBitmap(bitmap)
        }
    }

    fun getByteArrayToByBitmap(bitmap: Bitmap): ByteArray {
        val stream = ByteArrayOutputStream()
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, stream)
        return stream.toByteArray()
    }
    fun dataPickerDialog(): Calendar{
        val calendar: Calendar = Calendar.getInstance()
        val ngay = calendar.get(Calendar.DATE)
        val thang = calendar.get(Calendar.MONTH)
        val nam = calendar.get(Calendar.YEAR)
        val dialog = DatePickerDialog(this@RegisterUserActivity, OnDateSetListener { view, year, month, dayOfMonth ->
            calendar.set(year, month, dayOfMonth)
            var simpleDateFormat: SimpleDateFormat = SimpleDateFormat("dd/MM/yyyy")
            tvbirthday.setText(simpleDateFormat.format(calendar.time))
        }, nam, thang, ngay)
        dialog.show()
        return calendar
    }
    private fun attemptRegister() {
        name.error = null
        email.error = null
        street.error = null
        district.error = null
        city.error = null
        password.error = null
        phonenumber.error = null
        // Store values at the time of the login attempt.
        val nameStr = name.text.toString()
        val emailStr = email.text.toString()
        val streetStr = street.text.toString()
        val districtStr = district.text.toString()
        val cityStr = city.text.toString()
        val passwordStr = password.text.toString()
        val cfPassword = cfpassword.text.toString()
        val phonenumberStr = phonenumber.text.toString()

        var cancel = false
        var focusView: View? = null
        // Check for a valid password, if the user entered one.
        if (TextUtils.isEmpty(nameStr)) {
            name.error = getString(R.string.error_field_required)
            focusView = name
            cancel = true
        }
        if (TextUtils.isEmpty(streetStr)) {
            street.error = getString(R.string.error_field_required)
            focusView = street
            cancel = true
        }
        if (TextUtils.isEmpty(districtStr)) {
            district.error = getString(R.string.error_field_required)
            focusView = district
            cancel = true
        }
        if (TextUtils.isEmpty(cityStr)) {
            city.error = getString(R.string.error_field_required)
            focusView = city
            cancel = true
        }
        if (TextUtils.isEmpty(phonenumberStr.toString())) {
            phonenumber.error = getString(R.string.error_field_required)
            focusView = phonenumber
            cancel = true
        }
        if (!isPasswordValid(passwordStr)) {
            password.error = getString(R.string.error_invalid_password)
            focusView = password
            cancel = true
        }
        if (!isCfPasswordValid(passwordStr, cfPassword)) {
            password.error = getString(R.string.error_invalid_password)
            focusView = password
            cancel = true
        }
        if(!isPhoneNumberValid(phonenumberStr)){
            phonenumber.error = getString(R.string.error_invalid_phonenumber)
            focusView = phonenumber
            cancel = true
        }
        // Check for a valid email address.
        if (TextUtils.isEmpty(emailStr)) {
            email.error = getString(R.string.error_field_required)
            focusView = email
            cancel = true
        } else if (!isEmailValid(emailStr)) {
            email.error = getString(R.string.error_invalid_email)
            focusView = email
            cancel = true
        }

        if (cancel) {
            focusView?.requestFocus()
        } else {
            val byte = getByteArrayToByBitmap(bitmap!!)
            var data: JSONObject = JSONObject()
            data.put("name", nameStr)
            data.put("email", emailStr)
            data.put("street", streetStr)
            data.put("district", districtStr)
            data.put("city", cityStr)
            data.put("phonenumber", phonenumberStr)
            data.put("homephone", homephonenumber.text.toString())
            data.put("dob", dob)
            data.put("password", md5(passwordStr))
            data.put("img", byte)
            mSocket.emit("login", data)
        }
    }
    private fun isEmailValid(email: String): Boolean {
        if (!email.contains("@")) {
            return false
        }else{
            return true
        }
    }

    private fun isPasswordValid(password: String): Boolean {
        if (password.length < 6 ) {
            return false
        }else{
            return true
        }
    }
    private fun isPhoneNumberValid(phone: String): Boolean {
        try {
            Integer.parseInt(phone)
            return true
        } catch (e: NumberFormatException) {
            return false
            // xử lý khi số nhập vào ko đúng
        }

    }
    private fun isCfPasswordValid(password: String, cfPassword: String): Boolean {
        if (!password.equals(cfPassword)) {
            return false
        }else{
            return true
        }
    }
    fun md5(s: String): String {
        val MD5 = "MD5"
        try {
            // Create MD5 Hash
            val digest = java.security.MessageDigest
                    .getInstance(MD5)
            digest.update(s.toByteArray())
            val messageDigest = digest.digest()

            // Create Hex String
            val hexString = StringBuilder()
            for (aMessageDigest in messageDigest) {
                var h = Integer.toHexString(0xFF and 0x100)
                while (h.length < 2)
                    h = "0" + h
                hexString.append(h)
            }
            return hexString.toString()

        } catch (e: NoSuchAlgorithmException) {
            e.printStackTrace()
        }

        return ""
    }

    private fun resize(image: Bitmap, maxWidth: Int, maxHeight: Int): Bitmap {
        var image = image
        if (maxHeight > 0 && maxWidth > 0) {
            val width = image.width
            val height = image.height
            val ratioBitmap = width.toFloat() / height.toFloat()
            val ratioMax = maxWidth.toFloat() / maxHeight.toFloat()

            var finalWidth = maxWidth
            var finalHeight = maxHeight
            if (ratioMax > ratioBitmap) {
                finalWidth = (maxHeight.toFloat() * ratioBitmap).toInt()
            } else {
                finalHeight = (maxWidth.toFloat() / ratioBitmap).toInt()
            }
            image = Bitmap.createScaledBitmap(image, finalWidth, finalHeight, true)
            return image
        } else {
            return image
        }
    }



}
