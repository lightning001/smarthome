package com.example.josephpham.app.activity

import android.app.AlertDialog
import android.app.DatePickerDialog
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.support.v7.widget.Toolbar
import android.view.View
import com.example.josephpham.app.R
import kotlinx.android.synthetic.main.activity_register_user.*
import kotlinx.android.synthetic.main.activity_user.*
import kotlinx.android.synthetic.main.dialog_change_address.*
import kotlinx.android.synthetic.main.dialog_change_homephone.*
import kotlinx.android.synthetic.main.dialog_change_phonenumber.*
import java.text.SimpleDateFormat
import java.util.*

class UserActivity : AppCompatActivity() {

    var dob: Date? = null
    val user = LoginActivity.user

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_user)
        setSupportActionBar(toolbaruser)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        addEvent()

    }
    fun addEvent(){
        tvdiachi.setOnLongClickListener {
            openDialogChangeAddress()
        }
        tvphonenumber.setOnLongClickListener {
            openDialogChangePhoneNumber()
        }
        tvphonehome.setOnLongClickListener {
            openDialogChangeHomePhoneNumber()
        }
        tvdob.setOnLongClickListener {
            dataPickerDialog()
        }
    }

    private fun openDialogChangeHomePhoneNumber(): Boolean {
        val mBundle = AlertDialog.Builder(this@UserActivity)
        val mView = layoutInflater.inflate(R.layout.dialog_change_homephone, null)
        updatehomephone.setText(user.homephone)
        submithomephone.setOnClickListener {
            updateHomePhone()
        }
        return true
    }



    fun openDialogChangeAddress(): Boolean {
        val mBundle = AlertDialog.Builder(this@UserActivity)
        val mView = layoutInflater.inflate(R.layout.dialog_change_address, null)
        streetupdate.setText(user.street)
        districtupdate.setText(user.district)
        cityupdate.setText(user.city)
        postcode.setText(user.postcode)
        submitAddress.setOnClickListener {
            updateAddress()
        }
        return true
    }
    fun openDialogChangePhoneNumber(): Boolean {
        val mBundle = AlertDialog.Builder(this@UserActivity)
        val mView = layoutInflater.inflate(R.layout.dialog_change_address, null)
        updatephonenumber.setText(user.city)
        postcode.setText(user.postcode)
        submitphonenumber.setOnClickListener {
            updatePhoneNumber()
        }
        return true

    }

    fun dataPickerDialog(): Boolean {
        val calendar: Calendar = Calendar.getInstance()
        val ngay = calendar.get(Calendar.DATE)
        val thang = calendar.get(Calendar.MONTH)
        val nam = calendar.get(Calendar.YEAR)
        val dialog = DatePickerDialog(this@UserActivity, DatePickerDialog.OnDateSetListener { view, year, month, dayOfMonth ->
            calendar.set(year, month, dayOfMonth)
            var simpleDateFormat: SimpleDateFormat = SimpleDateFormat("dd/MM/yyyy")
            tvbirthday.setText(simpleDateFormat.format(calendar.time))
        }, nam, thang, ngay)
        dialog.show()
        dob = calendar as Date
        return true
    }
    private fun updateHomePhone() {

    }

    private fun updateAddress() {

    }

    private fun updatePhoneNumber() {

    }
}
