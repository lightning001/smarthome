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
import java.text.SimpleDateFormat
import java.util.*
import android.graphics.Bitmap
import android.net.Uri
import android.provider.MediaStore
import android.util.Log
import android.widget.Toast
import com.example.josephpham.app.interfaces.MD5
import com.example.josephpham.app.interfaces.UploadIMG
import io.socket.emitter.Emitter
import org.json.JSONException
import java.io.ByteArrayOutputStream


class RegisterUserActivity : AppCompatActivity(), MD5, UploadIMG {

    var mSocket = LoginActivity.msocket
    var dob = Date()
    val REQUEST_TAKE_PICTURE = 123
    var bitmap: Bitmap? = null
    var random = Random()


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_register_user)
        event()
        LoginActivity.msocket.on("server_send_register", onretrieveDateRegister)

    }
    fun event(){
        tvbirthday.setOnClickListener {
            dob = dataPickerDialog()
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

    fun dataPickerDialog(): Date{
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
        return calendar.time
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
            cfpassword.error = getString(R.string.error_invalid_cfpassword)
            focusView = password
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
            mSocket.emit("client_send_register", data)
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

    private fun isCfPasswordValid(password: String, cfPassword: String): Boolean {
        if (!password.equals(cfPassword)) {
            return false
        }else{
            return true
        }
    }
    var onretrieveDateRegister: Emitter.Listener = Emitter.Listener { args ->
        runOnUiThread {
            val data1 = args[0] as JSONObject
            try {
                var correct = data1.getBoolean("success")
                if (correct == true) {
                    Toast.makeText(this@RegisterUserActivity, "register success", Toast.LENGTH_LONG).show()
                    var intent = Intent(this@RegisterUserActivity, LoginActivity::class.java)
                    startActivity(intent)

                } else {
                    val err = data1.getString("message")
                    Toast.makeText(this@RegisterUserActivity, err.toString().trim(), Toast.LENGTH_LONG).show()
                }
            } catch (e: JSONException) {
                Log.d("EEEE", e.toString())
            }
        }
    }
    var key : Int? = null
    fun rand(from: Int, to: Int) : Int {
        key = random.nextInt(to - from) + from
        return key as Int
    }
}
