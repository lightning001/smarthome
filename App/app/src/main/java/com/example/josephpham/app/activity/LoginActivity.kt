package com.example.josephpham.app.activity


import android.support.v7.app.AppCompatActivity
import android.app.LoaderManager.LoaderCallbacks
import android.content.Loader
import android.database.Cursor
import android.os.Bundle
import android.text.TextUtils
import android.view.View
import android.view.inputmethod.EditorInfo
import android.widget.TextView

import android.content.Intent
import android.os.AsyncTask
import android.os.Handler
import android.support.v7.app.AlertDialog
import android.util.Log
import android.view.LayoutInflater
import android.widget.Toast
import com.example.josephpham.app.R
import com.example.josephpham.app.connect.Connect
import com.example.josephpham.app.model.User
import io.socket.client.Socket
import io.socket.emitter.Emitter


import kotlinx.android.synthetic.main.activity_login.*
import kotlinx.android.synthetic.main.progress_dialog.*
import org.json.JSONException
import org.json.JSONObject
import java.security.NoSuchAlgorithmException


class LoginActivity : AppCompatActivity(){
    companion object {
        var user = User()
        var msocket: Socket = Connect.connect()
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)
        addEvent()
        msocket.connect()
        thuchien().execute()

    }
    fun addEvent(){
        password.setOnEditorActionListener(TextView.OnEditorActionListener { _, id, _ ->
            if (id == EditorInfo.IME_ACTION_DONE || id == EditorInfo.IME_NULL) {
                attemptLogin()
                return@OnEditorActionListener true
            }
            false
        })
        linkregister.setOnClickListener {
            val intent = Intent(this@LoginActivity, RegisterUserActivity::class.java)
            startActivity(intent)
        }
    }
    fun propressDialog(){
        val builder = AlertDialog.Builder(this@LoginActivity)
        val dialogView = layoutInflater.inflate(R.layout.progress_dialog, null)
        val message = dialogView.findViewById<TextView>(R.id.loading)
        message.text = "loading...."
        builder.setView(dialogView)
        builder.setCancelable(false)
        val dialog = builder.create()
        dialog.show()

        Handler().postDelayed({dialog.dismiss()}, 3000)
    }



    var onretrieveDateLogin: Emitter.Listener = Emitter.Listener { args ->
        runOnUiThread {
            val data1 = args[0] as JSONObject
            try {
                var correct = data1.getBoolean("error")
                if(correct != true) {
                    var userjson = data1.getJSONObject("Result")
                    user.parseJson(userjson)
                    Toast.makeText(this@LoginActivity, "login", Toast.LENGTH_LONG).show()
                    var intent = Intent(this@LoginActivity, MainActivity::class.java)
                    startActivity(intent)
                    propressDialog()

                }else{
                    val err = data1.getString("Result")
                    Toast.makeText(this@LoginActivity, err.toString(), Toast.LENGTH_LONG).show()
                }
            } catch (e: JSONException) {
                Log.d("EEEE", e.toString())
            }
        }
    }


    private fun attemptLogin() {
        email.error = null
        password.error = null
        // Store values at the time of the login attempt.
        val emailStr = email.text.toString()
        val passwordStr = password.text.toString()

        var cancel = false
        var focusView: View? = null
        // Check for a valid password, if the user entered one.
        if (!isPasswordValid(passwordStr)) {
            password.error = getString(R.string.error_invalid_password)
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
            var data: JSONObject = JSONObject()
            data.put("email", emailStr)
            data.put("password", md5(passwordStr))
            msocket.emit("login", data)
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

    inner class thuchien : AsyncTask<Unit, Void, String>() {

        override fun doInBackground(vararg params: Unit?): String {
            email_sign_in_button.setOnClickListener { attemptLogin() }
            msocket.on("LoginResult", onretrieveDateLogin)
            return ""
        }

    }

}
