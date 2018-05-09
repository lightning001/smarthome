package com.example.josephpham.app.activity


import android.support.v7.app.AppCompatActivity
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
import android.widget.Toast
import com.example.josephpham.app.R
import com.example.josephpham.app.interfaces.MD5
import com.example.josephpham.app.connect.Connect
import com.example.josephpham.app.interfaces.JWTUtils
import com.example.josephpham.app.model.User
import io.socket.client.Socket
import io.socket.emitter.Emitter


import kotlinx.android.synthetic.main.activity_login.*
import org.json.JSONException
import org.json.JSONObject


class LoginActivity() : AppCompatActivity(), MD5, JWTUtils  {
    override lateinit var keytoken: String
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
        linkforgotpw.setOnClickListener {
            val intent = Intent(this@LoginActivity, AddDeviceActivity::class.java)
            startActivity(intent)
        }
    }

    var onretrieveDateLogin: Emitter.Listener = Emitter.Listener { args ->
        runOnUiThread {

            val token = args[0] as JSONObject
            Log.d("token", token.toString())
            try {
                var correct = token.getBoolean("success")
                if(correct == true) {
                    var token = token.get("token")

                    var userjson = decoded(token as String)
                    user.parseJson(JSONObject(userjson))
                    Log.d("user", user.name)
                    Toast.makeText(this@LoginActivity, user.toString(), Toast.LENGTH_LONG).show()
                    var intent = Intent(this@LoginActivity, MainActivity::class.java)
                    startActivity(intent)

                }else{
                    val err = token.getString("message")
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
            msocket.emit("client_send_login", data)
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



    inner class thuchien : AsyncTask<Unit, Void, String>() {

        override fun doInBackground(vararg params: Unit?): String {
            email_sign_in_button.setOnClickListener { attemptLogin() }
            msocket.on("server_send_login", onretrieveDateLogin)
            return ""
        }

    }

}
