package com.example.josephpham.app.activity

import android.app.Activity
import android.content.Intent
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.speech.RecognizerIntent
import android.widget.Toast
import com.example.josephpham.app.R
import kotlinx.android.synthetic.main.activity_setting_device.*
import java.util.*
import android.content.ActivityNotFoundException
import android.support.v7.widget.LinearLayoutManager
import com.example.josephpham.app.model.DeviceInRoom
import android.widget.CompoundButton
import com.example.josephpham.app.adapter.KeyAdapter
import kotlinx.android.synthetic.main.activity_register_user.*


class SettingDeviceActivity : AppCompatActivity() {
    private val REQ_CODE_SPEECH_INPUT = 100
    val device: DeviceInRoom?= null
    var checkOnOff = false


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_setting_device)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        val bundle = intent.extras
        val  idDevice = bundle.getString("id_device_in_room")
        val token = MainActivity.token
        addEvent()
        listKey()


    }

    private fun listKey() {
        list_key.layoutManager = LinearLayoutManager(this@SettingDeviceActivity, LinearLayoutManager.VERTICAL, false)
        val adapter = KeyAdapter(this@SettingDeviceActivity)
        list_key.adapter = adapter
    }

    private fun addEvent() {
        toggleButton1.setOnCheckedChangeListener(object : CompoundButton.OnCheckedChangeListener {
            override fun onCheckedChanged(buttonView: CompoundButton,
                                          isChecked: Boolean) {
                checkOnOff = isChecked

                if (isChecked) {
                    on_off.setText("incantations for on this device")
                } else {
                    on_off.setText("incantations for off this device")
                }

            }
        })
        btn_speech.setOnClickListener {
            getSpeechInput()
        }
        btn_add_key.setOnClickListener {
            if(checkOnOff == false){

                Toast.makeText(this@SettingDeviceActivity, "added to list incantations for off this device", Toast.LENGTH_LONG).show()

            }else {
                Toast.makeText(this@SettingDeviceActivity, "added to list incantations for off this device", Toast.LENGTH_LONG).show()
            }
        }
    }

    fun getSpeechInput(){
        val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH)
        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL,
                RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, Locale.getDefault())
        intent.putExtra(RecognizerIntent.EXTRA_PROMPT,
                getString(R.string.speech_prompt))
        try {
            startActivityForResult(intent, REQ_CODE_SPEECH_INPUT)
        } catch (a: ActivityNotFoundException) {
            Toast.makeText(applicationContext,
                    getString(R.string.speech_not_supported),
                    Toast.LENGTH_SHORT).show()
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        when (requestCode) {
            REQ_CODE_SPEECH_INPUT -> {
                if (resultCode == Activity.RESULT_OK && null != data) {

                    val result = data
                            .getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS)
                    tv_speech.setText(result[0])
                }
            }
        }
    }

}
